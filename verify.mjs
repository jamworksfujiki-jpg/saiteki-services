import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

const pages = [
  ['index', 'https://saiteki-services.vercel.app/'],
  ['genchi', 'https://saiteki-services.vercel.app/genchi-busshou.html'],
  ['tsuhan', 'https://saiteki-services.vercel.app/tsuhan.html'],
  ['seizou', 'https://saiteki-services.vercel.app/seizou.html'],
  ['system', 'https://saiteki-services.vercel.app/system.html'],
];

for (const [name, url] of pages) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `verify-${name}-pc.png`, fullPage: true });
  console.log(`✓ ${name}`);
}
await browser.close();
