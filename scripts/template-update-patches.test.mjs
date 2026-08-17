import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const updatesRoot = join(repoRoot, ".template", "updates");
const unifiedHunkHeader = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@(?: .*)?$/;

test("all template update patches are valid unified diffs", async () => {
  const entries = await readdir(updatesRoot, { withFileTypes: true });
  const failures = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const patchPath = join(updatesRoot, entry.name, "patch.diff");
    const displayPath = relative(repoRoot, patchPath);
    const patch = await readFile(patchPath, "utf8");
    const lines = patch.split("\n");
    const hunkHeaders = lines.map((line, index) => ({ index, line, lineNumber: index + 1 })).filter(({ line }) => line.startsWith("@@"));

    if (hunkHeaders.length === 0) {
      failures.push(`${displayPath}: missing unified-diff hunk headers`);
      continue;
    }

    for (const { index, line, lineNumber } of hunkHeaders) {
      const match = unifiedHunkHeader.exec(line);

      if (!match) {
        failures.push(`${displayPath}:${lineNumber}: malformed hunk header ${JSON.stringify(line)}`);
        continue;
      }

      const expectedOldLines = match[2] === undefined ? 1 : Number(match[2]);
      const expectedNewLines = match[4] === undefined ? 1 : Number(match[4]);
      let actualOldLines = 0;
      let actualNewLines = 0;

      for (const bodyLine of lines.slice(index + 1)) {
        if (bodyLine.startsWith("@@") || bodyLine.startsWith("diff --git ")) break;
        if (bodyLine === "\\ No newline at end of file") continue;
        if (bodyLine === "" && actualOldLines >= expectedOldLines && actualNewLines >= expectedNewLines) break;
        if (bodyLine === "") {
          actualOldLines += 1;
          actualNewLines += 1;
          continue;
        }
        if (bodyLine.startsWith(" ") || bodyLine.startsWith("-")) actualOldLines += 1;
        if (bodyLine.startsWith(" ") || bodyLine.startsWith("+")) actualNewLines += 1;
      }

      if (actualOldLines !== expectedOldLines || actualNewLines !== expectedNewLines) {
        failures.push(
          `${displayPath}:${lineNumber}: hunk declares ${expectedOldLines}/${expectedNewLines} old/new lines but contains ${actualOldLines}/${actualNewLines}`,
        );
      }
    }

    const result = spawnSync("git", ["apply", "--numstat", patchPath], {
      cwd: repoRoot,
      encoding: "utf8",
    });

    if (result.status !== 0) {
      failures.push(`${displayPath}: ${result.stderr.trim() || "git could not parse the patch"}`);
    }
  }

  assert.deepEqual(failures, []);
});
