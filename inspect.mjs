import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto('https://saiteki-net.jp/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

// 各キーワードが1ページ内のどこに出現するかを全部列挙
const hits = await page.evaluate(() => {
  const keywords = ['エンタメ物販', 'EC物流', 'クラウドファンディング', 'インバウンド', 'サイテキ化'];
  const out = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const t = node.textContent;
    for (const kw of keywords) {
      if (t.includes(kw)) {
        const el = node.parentElement;
        const r = el.getBoundingClientRect();
        out.push({
          kw,
          text: t.trim().slice(0, 60),
          tag: el.tagName,
          cls: el.className?.toString().slice(0, 80),
          top: Math.round(r.top + window.scrollY),
          left: Math.round(r.left),
          w: Math.round(r.width),
          h: Math.round(r.height),
        });
      }
    }
  }
  return out;
});
console.log(JSON.stringify(hits, null, 2));
await browser.close();
