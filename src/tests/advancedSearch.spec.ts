import { test, expect } from '@playwright/test';

test('Advanced Search - results for title=harry and year=2000', async ({ page }) => {
    await page.goto('http://localhost:5173/advanced-search?title=harry+potter&first_publish_year=2000');

    // First card visible
    const firstResult = page.locator('ul > li').first();
    await expect(firstResult).toBeVisible();

    // Title exists
    await expect(firstResult.getByRole('heading', { level: 3 })).toHaveText(/harry/i);

    // Author exists
    await expect(firstResult.locator('p.text-sm')).toHaveText(/2000/);
});
