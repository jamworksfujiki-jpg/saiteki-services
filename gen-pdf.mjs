import { chromium } from 'playwright';
import { resolve } from 'path';
import { pathToFileURL } from 'url';

const browser = await chromium.launch();
const page = await browser.newPage();
const fileUrl = pathToFileURL(resolve('design-report.html')).href;
await page.goto(fileUrl, { waitUntil: 'networkidle' });
await page.pdf({
  path: 'design-report.pdf',
  format: 'A4',
  margin: { top: '18mm', bottom: '18mm', left: '16mm', right: '16mm' },
  printBackground: true,
});
console.log('PDF generated: design-report.pdf');
await browser.close();
