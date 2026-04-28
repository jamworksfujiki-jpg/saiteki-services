import { readFileSync, writeFileSync } from 'fs';

const HEADER = `
  <header class="l-header">
    <div class="l-header__inner">
      <div class="l-header__logo">
        <a href="https://saiteki-net.jp/"><img src="assets/brand/logo.png" alt="株式会社サイテキ"></a>
      </div>
      <nav class="l-header__gnav">
        <ul class="c-gnav">
          <li><a href="https://saiteki-net.jp/activity/">私たちの取り組み</a></li>
          <li><a href="https://saiteki-net.jp/topic/">新着情報</a></li>
          <li><a href="https://saiteki-net.jp/interview/">インタビュー</a></li>
          <li><a href="https://saiteki-net.jp/history/">会社の沿革</a></li>
          <li><a href="https://saiteki-net.jp/company-info/">会社概要</a></li>
        </ul>
      </nav>
      <div class="w-header">
        <a class="w-header__cta" href="http://saiteki-net.jp/wordpress/contact-from/">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16v12H4z"/><path d="M4 6l8 7 8-7"/></svg>
          <span>お問い合わせ</span>
        </a>
      </div>
    </div>
  </header>
`;

const FOOTER = `  <div class="l-footer__before">
    <a href="https://saiteki-net.jp/"><img src="assets/brand/logo.png" alt="株式会社サイテキ"></a>
  </div>
  <footer class="l-footer">
    <div class="l-footer__foot">
      <div class="l-footer__inner">
        <ul class="l-footer__nav">
          <li><a href="https://saiteki-net.jp/">TOP</a></li>
          <li><a href="https://saiteki-net.jp/activity/">私たちの取り組み</a></li>
          <li><a href="https://saiteki-net.jp/topic/">新着情報</a></li>
          <li><a href="https://saiteki-net.jp/report/">実績</a></li>
          <li><a href="https://saiteki-net.jp/interview/">インタビュー</a></li>
          <li><a href="https://saiteki-net.jp/history/">会社の沿革</a></li>
          <li><a href="https://saiteki-net.jp/company-info/">会社概要</a></li>
          <li><a href="http://saiteki-net.jp/wordpress/contact-from/">お問い合わせ</a></li>
          <li><a href="https://saiteki-net.jp/privacy-policy/">プライバシーポリシー</a></li>
        </ul>
        <p class="l-footer__copyright">&copy; 株式会社サイテキ 2023</p>
      </div>
    </div>
  </footer>
`;

const files = [
  'module01-salesfloor.html',
  'module02-optim.html',
  'module03-postim.html',
  'module04-ectim.html',
  'service05-planning.html',
];

for (const f of files) {
  let html = readFileSync(f, 'utf8');
  // Insert header after <body>
  html = html.replace(/<body>\s*/, `<body>\n${HEADER}\n`);
  // Replace existing simple footer with new saiteki footer
  html = html.replace(
    /<footer class="footer">[\s\S]*?<\/footer>/,
    FOOTER.trim()
  );
  writeFileSync(f, html);
  console.log('updated', f);
}
