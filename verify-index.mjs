import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto('https://saiteki-services.vercel.app/?t=' + Date.now(), { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.screenshot({ path: 'verify-index-current.png', fullPage: true });
const heading = await page.textContent('.replace-head h2').catch(() => null);
const lead = await page.textContent('.replace-lead').catch(() => null);
console.log('H2:', heading?.replace(/\s+/g, ' ').trim());
console.log('LEAD:', lead?.replace(/\s+/g, ' ').trim());
await browser.close();
