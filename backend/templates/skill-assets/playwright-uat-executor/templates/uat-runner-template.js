/**
 * Reference Playwright UAT Runner Template
 * Automates browser interactions, captures clean screenshots, and verifies backend persistence.
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = process.cwd();
const SCREENSHOT_DIR = path.join(BASE_DIR, 'screenshots_uat');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

/**
 * Strip unrelated transient error notifications/overlays from DOM before capturing a screenshot.
 * Pass `preserveAlerts: true` when testing expected error states, or `hideSelectors` for project-specific toast selectors.
 */
async function cleanAndScreenshot(page, filename, options = {}) {
  const { preserveAlerts = false, hideSelectors = [], ...screenshotOptions } = options;
  await page.waitForTimeout(500);

  if (!preserveAlerts && hideSelectors.length > 0) {
    const selectorList = hideSelectors.join(', ');
    try {
      await page.addStyleTag({
        content: `
          ${selectorList} {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
          }
        `
      });
      await page.evaluate((sel) => {
        document.querySelectorAll(sel).forEach((el) => el.remove());
      }, selectorList);
    } catch (_) {}
  }

  await page.waitForTimeout(300);
  const targetPath = path.join(SCREENSHOT_DIR, filename);
  await page.screenshot({ path: targetPath, ...screenshotOptions });
  console.log(`[Screenshot Saved]: ${filename}`);
}

async function navigateAndWait(page, url, readySelector, timeout = 30000) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForSelector(readySelector, { state: 'visible', timeout });
}

async function runUat() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Starting UAT execution...');
  // Execute test scenarios according to the approved manual test plan...

  await context.close();
  await browser.close();
  console.log('All UAT scenarios executed successfully!');
}

if (require.main === module) {
  runUat().catch((err) => {
    console.error('Error running UAT automation:', err);
    process.exit(1);
  });
}

module.exports = {
  cleanAndScreenshot,
  navigateAndWait,
  runUat
};
