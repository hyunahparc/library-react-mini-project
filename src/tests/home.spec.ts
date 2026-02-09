import { test, expect } from '@playwright/test';

test('Home Page - Recent Updates section shows items', async ({ page }) => {
    // 1. Go to homepage
    await page.goto('http://localhost:5173/');

    // 2. Check Recent Updates section exists
    await expect(page.getByText("Recent Library Updates")).toBeVisible();

    // 3. Check that at least one card is visible
    const firstCard = page.locator('section:has-text("Recent Library Updates") div').nth(1);
    await expect(firstCard).toBeVisible();

    // 4. Check label & key text exists
    await expect(firstCard.getByText(/🆕|✏️|👤|📄/)).toBeVisible();
    await expect(firstCard.locator('p').nth(1)).toHaveText(/./); // any non-empty text
});
