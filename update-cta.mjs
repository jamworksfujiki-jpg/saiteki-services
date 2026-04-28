import { readFileSync, writeFileSync } from 'fs';

const BRAND_BLOCK = `      <div class="bottom-cta-brand">
        <img src="assets/brand/logo.png" alt="株式会社サイテキ">
        <span class="brand-name">SAITEKI INC.</span>
      </div>
`;

const files = [
  'index.html',
  'module01-salesfloor.html',
  'module02-optim.html',
  'module03-postim.html',
  'module04-ectim.html',
  'service05-planning.html',
];

for (const f of files) {
  let html = readFileSync(f, 'utf8');

  // 1. Insert brand block at top of .bottom-cta-inner (only sub pages have it)
  if (html.includes('bottom-cta-inner') && !html.includes('bottom-cta-brand')) {
    html = html.replace(
      /(<div class="bottom-cta-inner">\s*)/,
      `$1\n${BRAND_BLOCK}`
    );
  }

  // 2. Remove .l-footer__before duplicate logo block
  html = html.replace(
    /\s*<div class="l-footer__before">[\s\S]*?<\/div>\s*(?=<footer class="l-footer">)/,
    '\n  '
  );

  writeFileSync(f, html);
  console.log('updated', f);
}
