import { expect, test } from "@playwright/test";

test.describe("public routes render", () => {
  test("landing page loads and shows the brand", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Invitely/i);
    await expect(page.getByText(/Invitely/i).first()).toBeVisible();
  });

  test("sign-in page renders the Google button", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveTitle(/Sign In/i);
    await expect(page.getByRole("button", { name: /google/i })).toBeVisible();
  });

  test("privacy and terms pages load", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await page.goto("/terms");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("dashboard routes redirect anonymous users to /login", async ({
    page,
  }) => {
    await page.goto("/workspace");
    await expect(page).toHaveURL(/\/login$/);
  });
});
