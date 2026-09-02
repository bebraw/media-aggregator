import { expect, test } from "@playwright/test";

test("renders and filters the preview headline dashboard", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "GLOBAL HEADLINE INDEX" })).toBeVisible();
  await expect(page.getByText("PREVIEW DATA / NOT LIVE")).toBeVisible();
  await expect(page.locator("article")).toHaveCount(6);

  await page.getByRole("link", { name: "Europe" }).click();
  await expect(page).toHaveURL("/?region=europe");
  await expect(page.locator("article")).toHaveCount(1);
  await expect(page.getByText("Civic Dispatch")).toBeVisible();
});

test("serves the health endpoint", async ({ request }) => {
  const response = await request.get("/api/health");

  expect(response.ok()).toBe(true);
  await expect(response.json()).resolves.toEqual({
    ok: true,
    name: "media-aggregator",
    routes: ["/", "/api/health"],
  });
});

test("serves the generated stylesheet", async ({ request }) => {
  const response = await request.get("/styles.css");

  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("text/css");
  await expect(response.text()).resolves.toContain("--color-app-canvas:#f2f0e8");
});
