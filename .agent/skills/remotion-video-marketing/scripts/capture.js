const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

/**
 * Capture screenshots of key views from a running web application.
 * Usage: node capture.js <url> <output-dir>
 */

async function captureScreenshots() {
  const url = process.argv[2] || 'http://localhost:3000';
  const outDir = process.argv[3] || './marketing-assets';

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log(`Starting capture for ${url}...`);

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2, // High resolution for video usage
  });
  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    console.log('Navigated to URL, taking main screenshot...');
    await page.screenshot({ path: path.join(outDir, 'landing.png'), fullPage: true });

    // Include instructions on how to capture specific elements or states
    // e.g., await page.locator('.hero-section').screenshot({ path: ... });
    
    console.log(`Screenshots saved to ${outDir}`);
  } catch (err) {
    console.error(`Error capturing screenshots: ${err.message}`);
  } finally {
    await browser.close();
  }
}

captureScreenshots();
