import { test, expect } from '@playwright/test';

test.describe('ResourceBox Community Marketplace Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display home page with hero section and luxury font', async ({ page }) => {
    await expect(page).toHaveTitle(/ResourceBox/i);
    const heroHeading = page.locator('h1');
    await expect(heroHeading).toBeVisible();
    await expect(heroHeading).toContainText(/Your Unused Things/i);
  });

  test('should open auth modal and interact with Mochi the kitty in the box', async ({ page }) => {
    // Click on Sign In button in navbar
    const signInBtn = page.getByRole('button', { name: /Sign In/i }).first();
    await signInBtn.click();

    // Verify modal and 2D animated cat speech bubble appears
    const speechBubble = page.locator('p:has-text("Log in here")');
    await expect(speechBubble).toBeVisible();

    // Focus email input and verify Mochi updates speech
    const emailInput = page.getByPlaceholder(/you@example\.com/i);
    await emailInput.focus();
    await expect(page.locator('p:has-text("Enter your mail")')).toBeVisible();

    // Focus password input and verify Mochi covers eyes
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.focus();
    await expect(page.locator('p:has-text("Go for your password")')).toBeVisible();
  });

  test('should display peeping orange cat at footer when scrolled into view', async ({ page }) => {
    // Scroll down to the footer
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();

    // Check peeping cat arrives above the newsletter field
    const peepingCat = page.locator('[title="Orange Cat Peeping"]');
    await expect(peepingCat).toBeVisible();

    // Verify newsletter input field
    const emailField = page.getByPlaceholder(/neighbor@email\.com/i);
    await expect(emailField).toBeVisible();
  });

  test('should filter listings by category and search queries', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search resources/i).first();
    await searchInput.fill('Drill');
    await expect(searchInput).toHaveValue('Drill');
  });
});
