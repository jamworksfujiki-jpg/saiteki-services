import { chromium } from 'playwright';
import fs from 'fs';
import https from 'https';
import http from 'http';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();

const urls = [
  'https://saiteki-net.jp/',
  'https://saiteki-net.jp/activity/',
  'https://saiteki-net.jp/interview/',
];
const imgs = new Set();
for (const u of urls) {
  await page.goto(u, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const found = await page.evaluate(() => {
    return [...document.querySelectorAll('img')]
      .map(i => i.src)
      .filter(s => s && s.startsWith('http'));
  });
  found.forEach(s => imgs.add(s));
}
await browser.close();

console.log('Found', imgs.size, 'images');
// EC/通販/発送っぽそうなものを抽出
const keywords = ['ec', 'tuhan', 'ship', 'haisou', 'delivery', 'box', 'ectim', 'optim', 'event', 'venue', 'goods', 'phone', 'merch', 'ticket', 'bg', 'top'];
const candidates = [...imgs].filter(u => {
  const lower = u.toLowerCase();
  return keywords.some(k => lower.includes(k));
});
console.log('Candidates:');
candidates.forEach(c => console.log('  ', c));

// 全部保存
if (!fs.existsSync('assets/hp-images')) fs.mkdirSync('assets/hp-images', { recursive: true });
let i = 0;
for (const url of imgs) {
  if (!url.match(/\.(jpg|jpeg|png|webp)(\?|$)/i)) continue;
  const filename = url.split('/').pop().split('?')[0];
  const dest = `assets/hp-images/${filename}`;
  if (fs.existsSync(dest)) continue;
  await new Promise((res) => {
    const get = url.startsWith('https:') ? https.get : http.get;
    get(url, (resp) => {
      if (resp.statusCode !== 200) { res(); return; }
      const stream = fs.createWriteStream(dest);
      resp.pipe(stream);
      stream.on('finish', () => { stream.close(); res(); });
    }).on('error', () => res());
  });
  i++;
}
console.log('Saved', i, 'images');
