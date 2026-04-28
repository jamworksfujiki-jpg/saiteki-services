import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto('https://saiteki-net.jp/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

// 「エンタメ物販」を含むspanを起点に、祖先をたどり「幅が全画面に近い」親を探す
const cardRegion = await page.evaluate(() => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  let target = null;
  while ((node = walker.nextNode())) {
    if (node.textContent.includes('エンタメ物販')) {
      target = node.parentElement;
      break;
    }
  }
  if (!target) return null;
  // 祖先をログ
  const chain = [];
  let el = target;
  while (el && el !== document.body) {
    const r = el.getBoundingClientRect();
    chain.push({
      tag: el.tagName,
      cls: el.className?.toString().slice(0, 120),
      top: Math.round(r.top + window.scrollY),
      bottom: Math.round(r.bottom + window.scrollY),
      w: Math.round(r.width),
      h: Math.round(r.height),
    });
    el = el.parentElement;
  }
  return chain;
});
console.log(JSON.stringify(cardRegion, null, 2));

// OPT!M バナーの位置も確認（カード終端の目印）
const optm = await page.evaluate(() => {
  const imgs = [...document.querySelectorAll('img')];
  return imgs.filter(i => (i.alt || '').includes('OPT') || (i.src || '').toLowerCase().includes('opt'))
    .map(i => {
      const r = i.getBoundingClientRect();
      return { alt: i.alt, src: i.src.slice(-60), top: Math.round(r.top + window.scrollY), h: Math.round(r.height) };
    });
});
console.log('OPT images:', JSON.stringify(optm, null, 2));

await browser.close();
