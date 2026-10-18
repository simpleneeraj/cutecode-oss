import { test, expect } from "@playwright/test";

test("home page loads", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBeTruthy();
});

test("dashboard redirects anonymous users to sign-in", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/account\/sign-in/);
});

test("sign-in page renders the email form", async ({ page }) => {
  await page.goto("/account/sign-in");
  await expect(page.getByLabel(/email address/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
});
