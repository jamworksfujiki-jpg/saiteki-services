import { chromium } from 'playwright';
import sharp from 'sharp';

const browser = await chromium.launch();

// 1) saiteki-net.jp 全体のスクショ（dpr=2）
const ctx1 = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
const page1 = await ctx1.newPage();
await page1.goto('https://saiteki-net.jp/', { waitUntil: 'networkidle' });
await page1.waitForTimeout(2000);
await page1.screenshot({ path: 'saiteki-original-full.png', fullPage: true });

// 4カードの CSS 座標を取得（.swell-block-columns__inner を起点）
const region = await page1.evaluate(() => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (node.textContent.includes('エンタメ物販')) {
      let el = node.parentElement;
      while (el && !el.className?.toString().includes('swell-block-columns__inner')) el = el.parentElement;
      if (el) {
        const r = el.getBoundingClientRect();
        return { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY };
      }
    }
  }
  return null;
});
console.log('4-card region (CSS px):', region);
// 視覚的にちょうどよく挿入するためマージンを取る
const dpr = 2;
const cutTop = Math.round((region.top - 20) * dpr);       // カード直前20pxマージン
const cutBottom = Math.round((region.bottom + 20) * dpr); // カード直後20pxマージン
console.log('cut range (device px):', cutTop, '-', cutBottom);

// 2) 新セクションのキャプチャ（fullPage → sharp でクロップ）
const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
const page2 = await ctx2.newPage();
await page2.goto('https://saiteki-services.vercel.app/', { waitUntil: 'networkidle' });
await page2.waitForTimeout(1000);
// ページを最後までスクロールしてレンダリング強制
await page2.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page2.waitForTimeout(500);
await page2.evaluate(() => window.scrollTo(0, 0));
await page2.waitForTimeout(300);

const newBounds = await page2.evaluate(() => {
  const tagline = document.querySelector('.tagline-block');
  const stats = document.querySelector('.stats-strip');
  const replace = document.querySelector('.replace-section');
  const top = tagline.getBoundingClientRect().top + window.scrollY;
  const lastEl = stats || replace;
  const bottom = lastEl.getBoundingClientRect().bottom + window.scrollY;
  return { top, bottom, height: bottom - top };
});
console.log('New section bounds (CSS px):', newBounds);
await page2.screenshot({ path: 'saiteki-new-full.png', fullPage: true });
await sharp('saiteki-new-full.png')
  .extract({
    left: 0,
    top: Math.round(newBounds.top * dpr),
    width: 1280 * dpr,
    height: Math.round(newBounds.height * dpr),
  })
  .toFile('saiteki-new-section.png');

await browser.close();

// 3) 合成
const origMeta = await sharp('saiteki-original-full.png').metadata();
const newMeta = await sharp('saiteki-new-section.png').metadata();
console.log('Original:', origMeta.width, 'x', origMeta.height);
console.log('New section:', newMeta.width, 'x', newMeta.height);

// 新セクションを元の横幅にリサイズ
const newResized = await sharp('saiteki-new-section.png').resize({ width: origMeta.width }).toBuffer();
const newResizedMeta = await sharp(newResized).metadata();

// 上部パーツ
const topPart = await sharp('saiteki-original-full.png')
  .extract({ left: 0, top: 0, width: origMeta.width, height: cutTop })
  .toBuffer();
// 下部パーツ
const bottomPart = await sharp('saiteki-original-full.png')
  .extract({ left: 0, top: cutBottom, width: origMeta.width, height: origMeta.height - cutTop - (cutBottom - cutTop) })
  .toBuffer();

const bottomH = origMeta.height - cutBottom;
const finalH = cutTop + newResizedMeta.height + bottomH;

await sharp({
  create: { width: origMeta.width, height: finalH, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } }
})
  .composite([
    { input: topPart, left: 0, top: 0 },
    { input: newResized, left: 0, top: cutTop },
    { input: bottomPart, left: 0, top: cutTop + newResizedMeta.height },
  ])
  .png()
  .toFile('saiteki-composite.png');

console.log('✓ saiteki-composite.png:', origMeta.width, 'x', finalH);

// PC向けにプレビュー用小サイズも生成
await sharp('saiteki-composite.png').resize({ width: 1280 }).toFile('saiteki-composite-small.png');
console.log('✓ saiteki-composite-small.png (1280 wide)');
