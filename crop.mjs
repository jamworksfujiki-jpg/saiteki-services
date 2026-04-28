import sharp from 'sharp';
import { mkdirSync } from 'fs';

mkdirSync('assets/parts', { recursive: true });

// Slides are 1920x1080. Bottom ~120px is the blue curved footer with logo.
const FOOTER_H = 130;
const BODY_H = 1080 - FOOTER_H;

// Helper: trim bottom footer from a slide
async function trimFooter(src, dst) {
  await sharp(src)
    .extract({ left: 0, top: 0, width: 1920, height: BODY_H })
    .toFile(dst);
}

// Helper: trim top header + bottom footer (body only)
async function bodyOnly(src, dst, topCut = 140) {
  await sharp(src)
    .extract({ left: 0, top: topCut, width: 1920, height: BODY_H - topCut })
    .toFile(dst);
}

// === Full slides with footer removed (for main visuals) ===
await trimFooter('assets/2.png', 'assets/parts/slide-2-issue.png');
await trimFooter('assets/3.png', 'assets/parts/slide-3-concept.png');
await trimFooter('assets/4.png', 'assets/parts/slide-4-maximize.png');
await trimFooter('assets/5.png', 'assets/parts/slide-5-module01.png');
await trimFooter('assets/6.png', 'assets/parts/slide-6-optim.png');
await trimFooter('assets/7.png', 'assets/parts/slide-7-optim-effects.png');
await trimFooter('assets/8.png', 'assets/parts/slide-8-postim.png');
await trimFooter('assets/9.png', 'assets/parts/slide-9-postim-effects.png');
await trimFooter('assets/10.png', 'assets/parts/slide-10-ectim.png');
await trimFooter('assets/11.png', 'assets/parts/slide-11-ectim-features.png');
await trimFooter('assets/12.png', 'assets/parts/slide-12-ectim-effects.png');
await trimFooter('assets/13.png', 'assets/parts/slide-13-impact.png');
await trimFooter('assets/14.png', 'assets/parts/slide-14-trinity.png');
await trimFooter('assets/15.png', 'assets/parts/slide-15-cases.png');
await trimFooter('assets/17.png', 'assets/parts/slide-17-flow.png');

// === Hero backgrounds (full slides) ===
await sharp('assets/1.png').resize(1920).toFile('assets/parts/hero-bg.jpg');
await sharp('assets/16.png').resize(1920).toFile('assets/parts/hero-bg-2.jpg');

// === Body-only versions (header trimmed too) — for inline infographics ===
await bodyOnly('assets/2.png', 'assets/parts/body-issue.png', 160);
await bodyOnly('assets/3.png', 'assets/parts/body-ot-concept.png', 160);
await bodyOnly('assets/4.png', 'assets/parts/body-maximize.png', 160);
await bodyOnly('assets/5.png', 'assets/parts/body-module01.png', 160);
await bodyOnly('assets/6.png', 'assets/parts/body-optim-flow.png', 160);
await bodyOnly('assets/7.png', 'assets/parts/body-optim-effects.png', 160);
await bodyOnly('assets/8.png', 'assets/parts/body-postim.png', 160);
await bodyOnly('assets/9.png', 'assets/parts/body-postim-effects.png', 160);
await bodyOnly('assets/10.png', 'assets/parts/body-ectim.png', 160);
await bodyOnly('assets/11.png', 'assets/parts/body-ectim-features.png', 160);
await bodyOnly('assets/12.png', 'assets/parts/body-ectim-effects.png', 160);
await bodyOnly('assets/13.png', 'assets/parts/body-impact.png', 160);
await bodyOnly('assets/14.png', 'assets/parts/body-trinity.png', 160);
await bodyOnly('assets/15.png', 'assets/parts/body-cases.png', 160);
// body-flow: trim header + footer + bottom contact area (keep only flow icons)
await sharp('assets/17.png')
  .extract({ left: 0, top: 160, width: 1920, height: 460 })
  .toFile('assets/parts/body-flow.png');

// ===== Individual phones from slide 6 (OPT!M) =====
// col1: capture full 18万 badge + OPT!M logo + phone, then mask out subtitle bleed
const col1Raw = await sharp('assets/6.png')
  .extract({ left: 0, top: 70, width: 630, height: 890 })
  .toBuffer();
// White mask: cover MODULE title bleed (full width top) + subtitle right of badge
const maskSvg = Buffer.from(
  `<svg width="630" height="890">
    <rect x="0" y="0" width="630" height="60" fill="white"/>
    <rect x="220" y="60" width="410" height="160" fill="white"/>
  </svg>`
);
await sharp(col1Raw)
  .composite([{ input: maskSvg, top: 0, left: 0 }])
  .toFile('assets/parts/optim-col1.png');

// col2: skip both subtitle and left arrow, phone area only
await sharp('assets/6.png')
  .extract({ left: 740, top: 295, width: 460, height: 665 })
  .toFile('assets/parts/optim-col2.png');

// ===== Slide 7 — split timebar (top half) and bar+icons (bottom half) =====
await sharp('assets/7.png')
  .extract({ left: 60, top: 160, width: 1800, height: 320 })
  .toFile('assets/parts/optim-effect-time.png');
await sharp('assets/7.png')
  .extract({ left: 60, top: 480, width: 1800, height: 470 })
  .toFile('assets/parts/optim-effect-chart.png');

// ===== Slide 8 (POST!M) — tablet image left + 4 POINTs right =====
await sharp('assets/8.png')
  .extract({ left: 80, top: 180, width: 900, height: 760 })
  .toFile('assets/parts/postim-device.png');
await sharp('assets/8.png')
  .extract({ left: 1000, top: 180, width: 860, height: 760 })
  .toFile('assets/parts/postim-points.png');

// ===== Slide 11 (ECT!M) — phone left, points right =====
await sharp('assets/11.png')
  .extract({ left: 100, top: 160, width: 540, height: 800 })
  .toFile('assets/parts/ectim-phone.png');
await sharp('assets/11.png')
  .extract({ left: 660, top: 160, width: 1200, height: 800 })
  .toFile('assets/parts/ectim-points.png');

// ===== Slide 13 (Impact) — 3 individual metric cards (tight crop, identical) =====
const IMPACT_TOP = 235;
const IMPACT_H = 700;
await sharp('assets/13.png')
  .extract({ left: 110, top: IMPACT_TOP, width: 580, height: IMPACT_H })
  .toFile('assets/parts/impact-1.png');
await sharp('assets/13.png')
  .extract({ left: 690, top: IMPACT_TOP, width: 580, height: IMPACT_H })
  .toFile('assets/parts/impact-2.png');
await sharp('assets/13.png')
  .extract({ left: 1270, top: IMPACT_TOP, width: 580, height: IMPACT_H })
  .toFile('assets/parts/impact-3.png');

// ===== Slide 15 (Cases) — already as body-cases.png; also crop 4 individual cards =====
await sharp('assets/15.png')
  .extract({ left: 100, top: 220, width: 850, height: 320 })
  .toFile('assets/parts/case-1.png');
await sharp('assets/15.png')
  .extract({ left: 980, top: 220, width: 850, height: 320 })
  .toFile('assets/parts/case-2.png');
await sharp('assets/15.png')
  .extract({ left: 100, top: 580, width: 850, height: 320 })
  .toFile('assets/parts/case-3.png');
await sharp('assets/15.png')
  .extract({ left: 980, top: 580, width: 850, height: 320 })
  .toFile('assets/parts/case-4.png');

console.log('done');
