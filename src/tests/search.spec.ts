import { test, expect } from '@playwright/test';

test('Search Page - results for "harry potter" are visible with pagination', async ({ page }) => {
    await page.goto('http://localhost:5173/search?q=harry+potter');

    // 1. First result visible
    const firstResult = page.locator('ul > li').first();
    await expect(firstResult).toBeVisible();

    // 2. Title contains "harry"
    await expect(firstResult.getByRole('heading', { level: 3 })).toHaveText(/harry/i);

    // 3. Author exists
    await expect(firstResult.locator('p.text-lg')).toHaveText(/./);

    // 4. Pagination: check if "Next" button exists
    const nextButton = page.getByRole('button', { name: /next/i });
    if (await nextButton.isVisible()) {
      await nextButton.click();

      // Wait for new results
      const newFirstResult = page.locator('ul > li').first();
      await expect(newFirstResult).toBeVisible();

      // Title still contains "harry"
      await expect(newFirstResult.getByRole('heading', { level: 3 })).toHaveText(/harry/i);
    }
});
