import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto('https://saiteki-services.vercel.app/module01-salesfloor.html', { waitUntil: 'networkidle' });

// Check DOM for header/footer
const info = await page.evaluate(() => {
  const header = document.querySelector('.l-header');
  const footer = document.querySelector('.l-footer');
  const logo = document.querySelector('.l-header__logo img');
  const cssLink = document.querySelector('link[rel="stylesheet"][href*="styles-common"]');
  return {
    hasHeader: !!header,
    hasFooter: !!footer,
    headerHTML: header ? header.outerHTML.slice(0, 300) : null,
    logoSrc: logo ? logo.src : null,
    logoNaturalWidth: logo ? logo.naturalWidth : null,
    cssHref: cssLink ? cssLink.href : null,
    bodyFirstChild: document.body.firstElementChild?.className || document.body.firstElementChild?.tagName,
  };
});
console.log(JSON.stringify(info, null, 2));

// Fetch CSS to verify .l-header rules exist
const cssResp = await page.request.get('https://saiteki-services.vercel.app/styles-common.css');
const cssText = await cssResp.text();
console.log('\nCSS has .l-header:', cssText.includes('.l-header'));
console.log('CSS has .l-footer:', cssText.includes('.l-footer'));
console.log('CSS length:', cssText.length);

await page.screenshot({ path: 'check-module01.png', fullPage: false });
console.log('\nScreenshot saved to check-module01.png');
await browser.close();
