import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

const urls = [
  ['index', 'https://saiteki-services.vercel.app/'],
  ['module02', 'https://saiteki-services.vercel.app/module02-optim.html'],
  ['module03', 'https://saiteki-services.vercel.app/module03-postim.html'],
  ['module04', 'https://saiteki-services.vercel.app/module04-ectim.html'],
  ['service05', 'https://saiteki-services.vercel.app/service05-planning.html'],
];

for (const [name, url] of urls) {
  await page.goto(url, { waitUntil: 'networkidle' });
  const result = await page.evaluate(() => {
    const w = window.innerWidth;
    const overflows = [];
    document.querySelectorAll('img, section, div').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > w + 1 || rect.left < -1) {
        overflows.push({
          tag: el.tagName,
          cls: el.className?.toString().slice(0, 60),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          src: el.tagName === 'IMG' ? el.src.split('/').pop() : null,
        });
      }
    });
    return { viewport: w, scrollWidth: document.documentElement.scrollWidth, overflows: overflows.slice(0, 12) };
  });
  console.log(`\n=== ${name} ===`);
  console.log('viewport', result.viewport, 'scrollWidth', result.scrollWidth);
  for (const o of result.overflows) console.log(' ', o);
}

await browser.close();
