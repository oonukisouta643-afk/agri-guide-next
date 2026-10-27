# 運用メモ（クラウドで動くタスク・ハンドブックが読めないとき向け）

このファイルはリポジトリにコミットされ、公開される前提で書いています。人名・メールアドレス・電話番号・面談の発言は書きません。詳しい経緯は、運営者の手元のハンドブック（リポジトリには入っていません）にあります。

## サイトの目的

「県北ふくしまAgri-Guide」（https://www.fukushima-agri-guide.jp ）は、福島県北の6市町村（伊達市・桑折町・国見町・二本松市・大玉村・本宮市）で農業を始めたい人に向けた情報サイトです。地域ごとの違い・お金・現実を前もって見せて、就農後のギャップと離脱を減らすことをねらっています。運営者は一人です。

## サイトの構成

| パス | 内容 | 公開 |
|---|---|---|
| `/` | トップ | 公開 |
| `/simulator` | 就農シミュレーター | 公開 |
| `/subsidies` | 補助金・支援制度の一覧 | 公開 |
| `/tools` | ツール集 | 公開（数値の多くは仮データ） |
| `/farmers` | 農家プロフィール | 公開（仮データ） |
| `/admin` | 行政向けの提案資料 | 非公開（noindex、`robots.ts` でブロック、サイト内リンクなし） |
| `/dashboard` | 内部ダッシュボード | 非公開（同上） |
| `/lab/farm-day` | 「農家の一日」の見本 | 非公開（noindex、サイト内リンクなし） |

- 段階A（push 前）で作るページ（`/soudan`、`/data` など）は、公開を決めるまで noindex にし、サイトマップとサイト内リンクに入れない。
- 技術：Next.js 14（App Router）＋ TypeScript ＋ Tailwind CSS。ホスティングは Vercel。データは DB ではなく `src/data/` の TypeScript ファイル。

## 内容のルール（`CLAUDE.md` と同じ）

- **数字を作らない。** 調べていない値は「仮データ」と画面に出す。
- 補助金などの数字は、公式の出典と年を確かめてから載せる。URL は実際に開いて確かめる（推測で書かない）。
- 公開ページに、農家さんや行政職員の実名・連絡先を出さない（本人の了承がある場合を除く）。
- 既存の農家さんの園地を「チャンス」「空き」のように書かない。「先輩の園地を受け継ぐ」「託してもらう」と書く。
- 断定・誇張をしない（「唯一」「必ず稼げる」などは使わない）。
- 情報の主語（だれが、だれについて言ったのか）を取り違えない。

## `main` への反映の流れ

`main` に入ったものは、Vercel で本番に自動で公開されます。

1. 作業用のブランチを切って変更する。
2. `npx tsc --noEmit`、`npx next lint`、`npm run build` を通す（Windows では `npm run build` が `/opengraph-image` の生成で止まることが分かっている。ほかのページが生成できていればよしとし、Vercel のプレビューで確かめる）。
3. `git status --short` と `git diff --stat` で、意図したファイルだけが変わっていることを確かめる。ファイルは1つずつ `git add` する（`git add -A`・`git add .` は使わない）。
4. コミットしてブランチを push し、PR を作る（ブランチの push も、運営者の確認をとってから）。
5. **マージは運営者が GitHub の画面で行う。** `main` に直接 push しない。

Vercel のプレビュー（PR ごとの確認用URL）は、URL を知っていれば誰でも見られます。外に出したくない中身は PR にも入れません。

### pre-commit フックの有効化

`git config core.hooksPath .githooks` が clone ごとに必要です。`npm install`（または `npm ci`）の `prepare` スクリプトで自動で設定されます（`.git` がない環境では何もしません）。手で設定する場合は次を実行します。

```
git config core.hooksPath .githooks
```

pre-commit（`.githooks/precommit-check.mjs`）が見るもの：実名の一覧（`.claude/local/blocked-names.txt`。運営者の手元だけにあり、コミットしない。1行に1つ）、20 を超える削除、非公開の資料（ハンドブック、`docs/history/`、`docs/data/` の xlsx）、型・lint のエラー（ここまで止める）、電話番号・メールアドレスの形、言い過ぎ、園地の書き方（ここは警告）。サイトに出してよい電話番号・メールアドレスは `.githooks/content-allowlist.json` に足します。

Claude Code では、`.claude/settings.json` の許可ルールと `.claude/hooks/guard-bash.mjs`（Bash・PowerShell の両方）が、`main` への push、`gh pr merge` などでの PR のマージ、`git add -A` などを止めます（GitHub のルールセットは承認0なので、PR のマージは仕組みではここでしか止まらない）。テストは `node .claude/hooks/tests/run.mjs`。

これらは**ベストエフォート**です。いちばん強い守りは GitHub のブランチ保護です。分かっている「すり抜けが残る書き方」：

- クォートの中の `$(git push ...)` のような書き方（許可ルールの deny に頼る）
- スクリプトのファイルを作ってから実行する形（`node script.mjs` の中で push するなど）
- Edit・Write ツールで `.githooks/`・`.claude/settings.json`・`.git/config` を書き換えること
- `git checkout -- .`・`git restore .`・`git stash -u`・`git rm -r`・`rm -r`（-f なし）など、一覧にない消し方
- フック自体が起動できないとき（node が見つからない等）は、コマンドがそのまま通る

## データの置き場所と更新の手順

- 補助金：`src/data/subsidies.ts`（地域キーごと）。表示は `src/components/subsidies/`。
- 地域：`src/data/regions.ts`（トップの「連携している地域」とシミュレーター）。
- `/admin` の各タブ：`src/data/admin/`。
- ツールの数値：`src/data/tools/`（多くは仮データ）。
- 農家プロフィール：`src/data/farmers.ts`（仮データ）。
- 内部ダッシュボード：`src/data/dashboard/`。
- サイトマップと robots：`src/app/sitemap.ts`、`src/app/robots.ts`。
- 更新するときは、数字ごとに出典（URL・資料名・年）をコードのコメントかデータに残し、上の「反映の流れ」で PR にする。

## 自動で動くタスクの決まり

| やってよいこと | やってはいけないこと |
|---|---|
| 読む、調べる、まとめる | `main`（と `production`）への push、PR のマージ |
| `claude/` で始まるブランチへの push と、PR の作成（タスクの目的がそれの場合だけ） | メールの送信（Gmail は**下書きまで**） |
| PR・issue へのコメント（タスクの目的がそれの場合だけ） | 行政・関係者への連絡、フォームの送信 |
| 結果の通知 | 実名・連絡先・面談の中身を、リポジトリ・PR・公開ページに書くこと |
| | 支払い、アカウントの設定の変更 |

- タスクを作るときの指示文には、この表の「やってはいけないこと」を必ず入れる。
- タスクを起こしたきっかけ（決まった時刻・PR）は、実行中の操作の承認の代わりにはならない。大事な操作は、実行の結果を運営者が見てから行う。
- 検算（レビュー）は `.claude/agents/reviewer.md` のチェックリストで行う。
