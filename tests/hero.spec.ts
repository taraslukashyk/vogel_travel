import { test, expect } from '@playwright/test';

test.describe('Hero Section', () => {
  test('should load hero section and check main elements', async ({ page }) => {
    await page.goto('/');
    
    // Check Navbar
    const navbar = page.locator('nav');
    await expect(navbar).toBeVisible();
    
    // Check Nav Links
    const links = page.locator('nav a');
    const linkCount = await links.count();
    console.log(`Found ${linkCount} navigation links`);
    
    // Check Hero Title
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toBeVisible();
    const titleContent = await heroTitle.textContent();
    console.log(`Hero Title: ${titleContent}`);
    
    // Screenshot
    await page.screenshot({ path: 'tests/screenshots/hero-desktop.png' });
  });

  test('should open booking modal on button click', async ({ page }) => {
    await page.goto('/');
    const orderButton = page.getByRole('button', { name: /Замовити Тур/i });
    await orderButton.click();
    
    // Check if modal is visible (assuming it has some identifiable text or role)
    await expect(page.getByRole('dialog')).toBeVisible();
  });
});
