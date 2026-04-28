import sharp from 'sharp';

// 差し替え部分を目立たせるため、上部のヒーローから新セクション終端までをクロップ
const full = sharp('saiteki-composite.png');
const meta = await full.metadata();

// 上端から3200px（device px）あたりまで切り出し。新セクション + 少し下のOPT!Mバナーあたりまで
const cropHeight = Math.min(4400, meta.height);
await sharp('saiteki-composite.png')
  .extract({ left: 0, top: 0, width: meta.width, height: cropHeight })
  .toFile('saiteki-composite-focused.png');

await sharp('saiteki-composite-focused.png').resize({ width: 1400 }).toFile('saiteki-composite-focused-preview.png');
console.log('✓ focused preview generated');
