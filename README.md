# 株式会社サイテキ LP

イベント物販の「最適化」を提供する株式会社サイテキの公式LPです。

**本番URL**: https://saiteki-services.vercel.app/

## 構成

| ファイル | 役割 |
|---|---|
| `index.html` / `hero-demo.html` | トップ（動画ヒーロー＋全セクション、内容同一） |
| `genchi-busshou.html` | SERVICE 01 ／ 現地物販運営 |
| `tsuhan.html` | SERVICE 02 ／ 通販運営 |
| `seizou.html` | SERVICE 03 ／ グッズ製造提案 |
| `system.html` | SERVICE 04 ／ システムレンタル |
| `genchi-report.html` | 現地レポート（事例＋哲学） |

### デザインシステム
- 共通CSS: `assets/css/figma-design.css`（カラー・タイポ・コンポーネント）
- ヒーロー画像・本文画像: `assets/parts/pptx/`（営業資料pptx由来）
- ロゴ・倉庫写真: `assets/brand/`

## デザイナー向け：作業の流れ

1. **クローン**
   ```
   gh repo clone jamworksfujiki-jpg/saiteki-services
   cd saiteki-services
   ```

2. **Claude Code で開く**
   - VSCode の Claude Code 拡張、または公式 CLI で `saiteki-services` フォルダを開いて作業

3. **ローカルで確認**
   ```
   npm install
   start index.html
   ```
   （`start` は Windows コマンド。Mac の場合は `open index.html`）

4. **コミット & push**
   ```
   git add <変更ファイル>
   git commit -m "design: ◯◯セクションのレイアウト調整"
   git push origin main
   ```

5. **自動デプロイ**
   - `main` への push をトリガーに GitHub Actions が動き、Vercel 本番に自動反映されます
   - デプロイ状況: [Actions タブ](../../actions)
   - 数十秒〜2分で https://saiteki-services.vercel.app/ に反映

## 編集ガイド

### よくある変更
| やりたいこと | 触るファイル |
|---|---|
| 全ページの色・タイポ・カードのデザイン共通変更 | `assets/css/figma-design.css` |
| トップだけの変更（動画ヒーロー・stats・services 等） | `index.html` ＝ `hero-demo.html`（両方同じ内容なので両方更新） |
| 特定の下層ページのテキスト・画像 | 該当 HTML ファイル（ページ内に `<style>` 5〜30行も含まれる） |
| 画像の追加 | `assets/parts/pptx/` または `assets/brand/` に配置してから HTML から参照 |

### 注意事項
- **本番URL `saiteki-net.jp` には触らない**（このリポジトリは LP のみ、本サイトは別ドメイン）
- 大幅変更は **別ブランチで作業 → PR レビュー** が安全（破壊的変更を防ぐため）
- `node_modules/` `verify-*.png` 等の中間ファイルは `.gitignore` で除外済み

## トラブル時
- 自動デプロイが失敗した場合: Actions タブのログを確認
- 緊急ロールバック: Vercel ダッシュボードから過去のデプロイを Promote

## メンテナンス担当
- 構築: 藤木義紀 (jamworksfujiki@gmail.com / fujiki@jamworks.jp)
- デザイン: 村林（共同編集権限あり）
