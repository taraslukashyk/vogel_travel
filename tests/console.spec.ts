import { test, expect } from '@playwright/test';

test.describe('Browser Console and Health', () => {
  test('should not have console errors on homepage', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
        console.error(`Browser Error: ${msg.text()}`);
      } else {
        console.log(`Browser Console: ${msg.text()}`);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(errors).toHaveLength(0);
    
    console.log(`Page title: ${await page.title()}`);
    
    await page.screenshot({ path: 'tests/screenshots/console-health.png' });
  });
});
