---
name: local-ci
description: Run GitHub Actions CI locally with Local CI. Use for workflow-sensitive validation, full PR or release readiness checks, and pause-and-retry debugging before pushing.
---

# Local CI

Run the repository's GitHub Actions workflow locally with the repo-pinned Local CI dependency.

## Run

Use the canonical project command:

```bash
npm run ci:local
```

The script selects the repository workflow, prewarms dependencies, emits NDJSON lifecycle events, and pauses failed runners for retry.

To run all relevant workflows outside the canonical script:

```bash
./node_modules/.bin/local-ci run --quiet --json --all --pause-on-failure
```

## Retry

When a step fails, fix the issue and retry the paused runner:

```bash
npm run ci:local:retry -- --name <runner-name>
```

To re-run from an earlier step:

```bash
npm run ci:local:retry -- --name <runner-name> --from-step <N>
```

Repeat until all jobs pass. Do not push to trigger remote CI when Local CI can run the workflow locally.

## Machine-readable output

The canonical command combines `--json` with `--quiet`. Local CI emits one NDJSON object per line on stdout, including `run.start`, job and step lifecycle events, `run.paused`, `run.finish`, and diagnostics. Set `LOCAL_CI_JSON=1` when invoking the binary directly to enable the same stream.

When stdout is not a TTY, `--pause-on-failure` detaches the worker and exits `77` when a step pauses. Use the `retry_cmd` from the `run.paused` event or the project retry command above.

When repository instructions require an output-filtering command wrapper, use its raw passthrough or proxy mode so lifecycle events remain live.
