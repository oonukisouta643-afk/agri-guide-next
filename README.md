# 県北ふくしまAgri-Guide — Next.js 14 移行プロジェクト

要件定義書「AgriGuide_Next移行_要件定義書v2.0」に基づくNext.js 14（App Router）+
Tailwind CSSへの移行プロジェクト。

## 現在の状態：Phase 1（セットアップ・デザインシステムの土台）着手済み

- [x] Next.js 14 App Router構成でプロジェクトセットアップ（F-01）
- [x] Tailwind CSS + CSS変数（デザイントークン）設定（F-02）
- [x] 共通Header（ロゴ・ナビ・CTA・モバイルドロワー）コンポーネント（F-04）
- [x] 共通Footer（ロゴ・リンク・連絡先・アンケートリンク）コンポーネント（F-05）
- [ ] Vercelデプロイ・fukushima-agri-guide.jpドメイン接続（F-03）※ユーザー側作業が必要（下記参照）

## セットアップ

```bash
npm install
npm run dev
```

http://localhost:3000 で確認できます。

## GitHubへのpush・Vercelデプロイ（要ユーザー作業）

このプロジェクトはClaudeのクラウドサンドボックス環境で作成されたため、
GitHub（oonukisouta643-afk）へのpushやVercel（fukushimaonukiチーム）への
デプロイに必要な認証情報がありません。以下の手順は大貫さんご自身の
PCで実行してください（「AgriGuide_プロジェクト追記版_2026年8月」F章の手順と同様）。

1. GitHubに `agri-guide-next` という名前でリポジトリを作成
2. このフォルダをそのリポジトリにpush
   ```bash
   git remote add origin https://github.com/oonukisouta643-afk/agri-guide-next.git
   git branch -M main
   git push -u origin main
   ```
3. vercel.com でfukushimaonukiチームからGitHubリポジトリ（agri-guide-next）を選択してインポート・デプロイ
4. デプロイ後、Vercelの「Domains」設定で `fukushima-agri-guide.jp` を
   このプロジェクトに追加（既存のnetlify-0816プロジェクトから移す場合はそちらの設定変更も必要）

## デザインシステム

`tailwind.config.ts` と `src/app/globals.css` に要件定義書§3のデザイントークン
（カラーパレット・タイポグラフィ・スペーシング・シャドウ・角丸）を実装済み。

## 次のフェーズ

Phase 2（トップLP全8セクション）以降は要件定義書v2.0の§5以降を参照して実装する。
