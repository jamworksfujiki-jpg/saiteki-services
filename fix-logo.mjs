import sharp from 'sharp';

// Read logo as raw RGBA, convert white-ish pixels (text) to black, keep blue (icon)
const src = sharp('assets/brand/logo.png').ensureAlpha();
const { data, info } = await src.raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

const out = Buffer.from(data);
for (let i = 0; i < out.length; i += channels) {
  const r = out[i], g = out[i + 1], b = out[i + 2], a = out[i + 3];
  // Skip transparent pixels
  if (a === 0) continue;
  // White-ish (the text glyphs): high luminance, low saturation
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const isWhitish = max > 200 && (max - min) < 30;
  if (isWhitish) {
    out[i] = 0;       // R
    out[i + 1] = 0;   // G
    out[i + 2] = 0;   // B
    // keep alpha
  }
}

await sharp(out, { raw: { width, height, channels } })
  .png()
  .toFile('assets/brand/logo-dark.png');
console.log('saved logo-dark.png');
