import { test, expect } from '@playwright/test';

test('Book Detail Page shows title, author, img and description', async ({ page }) => {
    await page.goto('http://localhost:5173/books/OL82563W');

    // Title
    await expect(page.getByRole('heading', { level: 2 })).toBeVisible();

    // Author
    await expect(page.locator('p.text-xl')).toHaveText(/by/i);

    // Cover image
    await expect(page.locator('img')).toBeVisible();

    // Description source
    await expect(page.getByText(/Source:/i)).toBeVisible();
});

