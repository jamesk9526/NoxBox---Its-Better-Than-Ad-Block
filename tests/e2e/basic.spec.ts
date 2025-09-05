import { test, expect } from '@playwright/test';

test.describe('NoxBox E2E Tests', () => {
  test('should load the application and display welcome screen', async ({ page }) => {
    // For now, we'll test the static HTML since we don't have full webview integration
    await page.goto('http://localhost:5173');

    // Check that the main elements are present
    await expect(page.locator('h1')).toContainText('Welcome to NoxBox');
    await expect(page.locator('.top-bar')).toBeVisible();
    await expect(page.locator('.bottom-bar')).toBeVisible();
  });

  test('should have working window controls', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Check that window control buttons exist
    await expect(page.locator('#minimize-btn')).toBeVisible();
    await expect(page.locator('#maximize-btn')).toBeVisible();
    await expect(page.locator('#close-btn')).toBeVisible();
  });

  test('should have settings panel that can be toggled', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Settings panel should be hidden initially
    await expect(page.locator('#settings-panel')).not.toBeVisible();

    // Click settings button
    await page.locator('#settings-btn').click();

    // Settings panel should now be visible
    await expect(page.locator('#settings-panel')).toBeVisible();

    // Click close button
    await page.locator('#close-settings-btn').click();

    // Settings panel should be hidden again
    await expect(page.locator('#settings-panel')).not.toBeVisible();
  });

  test('should have demo images that get blurred', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Check that demo images exist
    const images = page.locator('img');
    await expect(images).toHaveCount(2);

    // Images should have the media-blurred class applied
    for (const img of await images.all()) {
      await expect(img).toHaveClass(/media-blurred/);
    }
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Check ARIA labels on buttons
    await expect(page.locator('#minimize-btn')).toHaveAttribute('aria-label', 'Minimize');
    await expect(page.locator('#maximize-btn')).toHaveAttribute('aria-label', 'Maximize');
    await expect(page.locator('#close-btn')).toHaveAttribute('aria-label', 'Close');
    await expect(page.locator('#settings-btn')).toHaveAttribute('aria-label', 'Settings');
  });
});
