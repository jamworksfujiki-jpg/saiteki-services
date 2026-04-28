import { readFileSync, writeFileSync } from 'fs';

const CASE_HTML = `      <div class="case-grid">
        <div class="case-card">
          <div class="case-tag">音楽フェス</div>
          <h4>VIVA LA ROCK / RUSH BALL / MONSTER baSH</h4>
        </div>
        <div class="case-card">
          <div class="case-tag">舞台・ミュージカル</div>
          <h4>ミュージカル『ジョジョの奇妙な冒険』<br>ミュージカル『刀剣乱舞』</h4>
        </div>
        <div class="case-card">
          <div class="case-tag">アニメ・ゲーム</div>
          <h4>呪術廻戦 ファントムパレード<br>コミックマーケット</h4>
        </div>
        <div class="case-card">
          <div class="case-tag">アーティスト</div>
          <h4>緑黄色社会 / fripSide / ゲスの極み乙女</h4>
        </div>
      </div>`;

// Replace the case image-grid block with HTML cards
const CASE_RE = /<div class="image-grid cols-2">\s*<img src="assets\/parts\/case-1\.png"[^>]*>\s*<img src="assets\/parts\/case-2\.png"[^>]*>\s*<img src="assets\/parts\/case-3\.png"[^>]*>\s*<img src="assets\/parts\/case-4\.png"[^>]*>\s*<\/div>/;

const files = [
  'module01-salesfloor.html',
  'module02-optim.html',
  'module03-postim.html',
  'module04-ectim.html',
  'service05-planning.html',
];

for (const f of files) {
  let html = readFileSync(f, 'utf8');
  let changed = false;
  if (CASE_RE.test(html)) {
    html = html.replace(CASE_RE, CASE_HTML.trim());
    changed = true;
  }
  // Typo unification
  html = html
    .replace(/VIVA LA LOCK/g, 'VIVA LA ROCK')
    .replace(/MONSTER bash/g, 'MONSTER baSH')
    .replace(/fripside/g, 'fripSide')
    .replace(/平均購入金額 150% UP/g, '平均購入金額 156% UP');

  writeFileSync(f, html);
  console.log(changed ? '✓' : '·', f);
}
