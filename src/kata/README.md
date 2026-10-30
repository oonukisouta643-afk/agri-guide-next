# 福島県59市町村の「型」

福島県の59市町村について、農業を始める人が「どこで・何を・どのくらいの道のりで」を同じ物差しで比べるための、データの形＋取り込みの手順＋表示の部品です。要件は `docs/REQUIREMENTS_fukushima-kata_v0.2.md`（GitHub にはない）。

いまは Phase 2（公開データ）まで。県・ふくのうに渡すための説明（Phase 4）は、まだ書きかけです。

## フォルダ

| パス | 中身 |
|---|---|
| `src/kata/types.ts` | データの形（`Sourced`・`Source`・`Region`・`Municipality`・`CropRoadmap`）と差し込み口（`FieldNote` など） |
| `src/kata/roadmap.ts` | 道のりの計算 `calcRoadmap` と、その前提の定数 |
| `src/kata/index.ts` | データの読み口。公開の了承がない聞き取りはここで落とす |
| `src/kata/format.ts` | 表示の書き方（非公表・データなし・未取得を 0 にしない） |
| `src/kata/components/` | 表示の部品（Tailwind のクラスと props だけで動く） |
| `src/kata/data/*.json` | `kata:import` で作ったデータ。**手で書き換えない** |
| `scripts/kata/` | 取り込み（`import.mjs`）と検証（`validate.mjs`）。第3章の表は `spec.mjs` |
| `src/app/kata/` | 見本のページ（AgriGuide 側。noindex・サイトマップ外・サイト内リンクなし） |

`src/kata/` は AgriGuide 固有のファイルを import しません。切り出すときは `src/kata/` と `scripts/kata/` を持っていき、`@/kata` の別名（tsconfig の paths）と Tailwind の content に `src/kata/**` を足します。

## 取り込みの手順

ネットからは取りにいきません。公式ファイルは人が置きます。`data-raw/` は git に入りません。

1. 次のファイルを置く
   - `data-raw/open/`：県北ふくしまAgri-Guide「福島県59市町村 就農の地域データ」の CSV（2026年10月16日版。01・03・07・08・09・11・13 を使う）
   - `data-raw/soumu/000925835.xlsx`：総務省「全国地方公共団体コード」の Excel（令和6年1月1日現在。https://www.soumu.go.jp/denshijiti/code.html ）。ふりがなに使う
   - `data-raw/estat/e033-06-007.xlsx`：農林水産省「市町村別農業産出額（推計）」令和6年 確報 統計表1 福島県の Excel（e-Stat https://www.e-stat.go.jp/stat-search/files?stat_infid=000040477284 の「EXCEL」）。産出額（合計・部門別）と県内順位に使う
   - `data-raw/census2020/484307.xlsx`：福島県統計課「2020年農林業センサス農林業経営体調査結果（確定値）」の「02 農業経営体 10 世帯員の状況（個人経営体）」の Excel（https://www.pref.fukushima.lg.jp/sec/11045b/nourin2020.html ）。基幹的農業従事者数・65歳以上の割合に使う（シート「(12)」）。平均年齢（シート「(15)」）は東北農政局の値との照らし合わせに使う
2. `npm run kata:import` → `src/kata/data/*.json` ができる
3. `npm run kata:validate` → 「問題なし」と、ページごとの仮データの数が出る
4. `git diff src/kata/data` で差分を確かめてコミット

`kata:validate` は data-raw がなくても動きます（JSON と計算を確かめる）。data-raw があれば、`roadmap.ts` の定数と 08 の CSV も照らし合わせます。`roadmap.ts` を Node の型の取り除きで直接読むため、Node 22.18 以降が要る（確かめたのは Node 24.19）。

## 市町村ID・ふりがな・slug

- ID：全国地方公共団体コード（6桁）。公開用データ01の団体コードで、福島県「市町村コード」のページ（2026年10月28日に59件の一致を確認）・総務省の表と同じ
- ふりがな：総務省の表のカナをひらがなにしたもの
- slug：ふりがなから「し・まち・むら」を外し、`scripts/kata/lib.mjs` の表で機械的にローマ字にしたもの（長音の記号は付けない。例：こおり→koori、そうま→souma）

## データの種類

画面の数値には必ずバッジが付きます。`official`＝公式統計、`estimate`＝推計（note に計算式。推測で置いた値は note を「推測」で始める）、`field`＝現地の聞き取り（いまは空）、`placeholder`＝仮データ・未取得。値がないときは `value: null` で、`suppressed`（秘匿）か `unavailable`（公表なし・観測なし）か `placeholder`（未取得）のどれかになります。

## 道のりの計算

`calcRoadmap(crop, { areaA, route: "newPlanting" | "takeover", priceDeltaPct?, years? })`。計算式と定数は `roadmap.ts` の冒頭にあります。公開用データ08と同じ前提で、09の60aの値（円未満を四捨五入したもの）と一致することを `kata:validate` で確かめています。補助金は入れません。定数を変えると 09 との照合が外れます。前提を変えるときは、元の試算（公開用データ08・09）も直してから `kata:import` で照合の値（`roadmap-expected.json`）を作り直します。

## 統計の記号

農林水産省の統計（産出額・センサス）の記号は、「0」＝単位に満たないもの、「－」＝事実のないもの、「x」＝秘匿。型では「0」は 0 のまま（note に意味を書く）、「－」は `unavailable`（データなし）、「x」は `suppressed`（非公表）にする。

産出額の「その他」（麦類・雑穀・豆類・いも類・工芸農作物・その他作物・加工農産物）は、内訳に「x」があれば非公表にする。合計からほかの部門を引けば数字は出るが、秘匿された値が逆算できてしまうので引き算はしない。令和6年の福島県では「その他作物」が双葉町（「－」）以外すべて「x」のため、「その他」は全市町村で値が出ない。

令和5年の資料（MAFF NAVI ふくしま Vol.04）で檜枝岐村・大熊町の合計が「0」だったのは、元の資料（PDF）でも「0」（単位に満たないもの）と表示されていた。双葉町は「－」。2026年10月30日に確かめた。

## まだ入っていないもの

- 市町村の支援制度（公開用データ04・05）：`/kata` に出すかが未決のため
- ぶどう：単価と収量の立ち上がりの前提を確かめてから
- 最深積雪の一部（7市町村）：公開用データで未取得のため `placeholder`
- 差し込み口の中身（現地の聞き取り）
