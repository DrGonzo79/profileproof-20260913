import { expect, test } from "@playwright/test";

test("runs the self-audit and records a context decision", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /See the posts a recruiter/i })).toBeVisible();
  await page.getByRole("button", { name: "Run private demo scan" }).click();
  await expect(page.getByRole("status")).toContainText("5 posts checked");
  await expect(page.getByText("Hostility phrase match")).toBeVisible();
  await page.getByRole("button", { name: "Mark context reviewed" }).click();
  await expect(page.getByRole("button", { name: "Undo review decision" })).toBeVisible();
  await expect(page.getByText("1 decisions logged")).toBeVisible();
});

test("changes profession lens and filters findings", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Target profession").selectOption("general");
  await expect(page.getByLabel("Target profession")).toHaveValue("general");
  await page.getByRole("group", { name: "Severity filter" }).getByRole("button", { name: /High/ }).click();
  await expect(page.getByRole("button", { name: /X Hostility/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Instagram/ })).not.toBeVisible();
});

test("validates and assesses a fictional custom post", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Add & assess →" }).click();
  await expect(page.locator(".error")).toContainText("at least 12 characters");
  await page.getByLabel("Demo post text").fill("I was hungover after a fictional celebration.");
  await page.getByLabel("Demo platform").selectOption("Instagram");
  await page.getByRole("button", { name: "Add & assess →" }).click();
  await expect(page.getByRole("status")).toContainText("6 posts checked");
  await expect(page.getByText("Substance reference phrase match")).toBeVisible();
});

test("has no horizontal overflow on mobile through the primary workflow", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile-only overflow assertion");
  await page.goto("/");
  const before = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
  expect(before[0]).toBeLessThanOrEqual(before[1] + 1);
  await page.getByRole("button", { name: "Run private demo scan" }).click();
  await expect(page.getByRole("status")).toBeVisible();
  const after = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
  expect(after[0]).toBeLessThanOrEqual(after[1] + 1);
});
