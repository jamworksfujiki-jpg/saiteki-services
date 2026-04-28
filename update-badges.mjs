import { readFileSync, writeFileSync } from 'fs';

const files = [
  'module01-salesfloor.html',
  'module02-optim.html',
  'module03-postim.html',
  'module04-ectim.html',
  'service05-planning.html',
];

// Convert <div class="badge"><strong>X</strong>Y</div>
// to <div class="badge"><strong>X</strong><span class="label">Y</span></div>
const RE = /<div class="badge"><strong>([^<]+)<\/strong>([^<]+)<\/div>/g;

for (const f of files) {
  let html = readFileSync(f, 'utf8');
  const before = html;
  html = html.replace(RE, (_, num, label) => {
    return `<div class="badge"><strong>${num.trim()}</strong><span class="label">${label.trim()}</span></div>`;
  });
  if (html !== before) {
    writeFileSync(f, html);
    console.log('updated', f);
  } else {
    console.log('no change', f);
  }
}
