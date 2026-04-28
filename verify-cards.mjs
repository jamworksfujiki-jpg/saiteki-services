import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto('https://saiteki-services.vercel.app/?t=' + Date.now(), { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
// 4カードセクションにスクロール
await page.evaluate(() => {
  document.querySelector('.service-grid').scrollIntoView({ block: 'center' });
});
await page.waitForTimeout(1200);
const bounds = await page.evaluate(() => {
  const el = document.querySelector('.service-grid');
  const r = el.getBoundingClientRect();
  return { x: Math.max(0, r.x - 20), y: Math.max(0, r.y - 20), width: Math.min(1280, r.width + 40), height: Math.min(900, r.height + 40) };
});
await page.screenshot({ path: 'verify-cards.png', clip: bounds });
console.log('✓ verify-cards.png saved, bounds:', bounds);
await browser.close();
