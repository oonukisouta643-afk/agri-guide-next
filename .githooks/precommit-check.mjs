#!/usr/bin/env node
// git の pre-commit から呼ばれるチェック。ステージされた差分の「追加された行」だけを見る。
// 止めるもの：実名（.claude/local/blocked-names.txt）、20を超える削除、非公開の資料、型・lint のエラー。
// 警告だけのもの：電話番号・メールアドレスの形、言い過ぎ、園地の書き方。
// 詳しくは docs/INSTRUCTIONS_automation-base.md の「3-3」。

import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

const errors = [];
const warnings = [];

// 言い過ぎと園地の言葉のチェックから外すもの（チェックの一覧そのものにこれらの言葉が入っているため）。
const WORD_CHECK_EXEMPT = [/^\.claude\//, /^\.githooks\//, /^CLAUDE\.md$/, /^docs\/OPERATIONS\.md$/];

// コミットしてはいけないもの。
const FORBIDDEN_PATHS = [
  [/^docs\/AGRIGUIDE_HANDBOOK\.md$/, "ハンドブック（関係者の名前を含む）"],
  [/^docs\/HANDBOOK_SUMMARY\.md$/, "ハンドブックの要約（関係者の名前を含む）"],
  [/^docs\/history\//, "docs/history/（関係者の名前・連絡先を含む）"],
  [/^docs\/data\/.*\.xlsx$/, "docs/data/ の確認用xlsx"],
  [/^\.claude\/local\//, ".claude/local/（実名の一覧など）"],
];

const OVERCLAIM = ["唯一", "競合ゼロ", "コストゼロ", "必ず稼", "絶対に稼", "No.1"];
const GARDEN = ["チャンス", "空き園地", "空き農地", "空き畑", "空いている園地"];
const D = "[0-9０-９]";
const SEP = "[-－‐‑–—―ー−()（）]";
const PHONE = new RegExp(`${D}{2,5}${SEP}{1,2}${D}{1,4}${SEP}{1,2}${D}{3,4}`, "g");
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

function loadAllowlist() {
  const file = join(root, ".githooks", "content-allowlist.json");
  if (!existsSync(file)) return [];
  const data = JSON.parse(readFileSync(file, "utf8"));
  return Array.isArray(data.allow) ? data.allow : [];
}

function loadBlockedNames() {
  const file = process.env.AGRI_BLOCKED_NAMES_FILE || join(root, ".claude", "local", "blocked-names.txt");
  if (!existsSync(file)) {
    console.log("［お知らせ］名前の一覧がないため実名チェックを省略しました（.claude/local/blocked-names.txt）。");
    return [];
  }
  return readFileSync(file, "utf8")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s !== "" && !s.startsWith("#"));
}

// 1. 削除の数
const nameStatus = git("diff", "--cached", "--name-status", "-z").split("\0");
let deleted = 0;
for (let i = 0; i < nameStatus.length; i++) {
  const status = nameStatus[i];
  if (!status) continue;
  if (status.startsWith("R") || status.startsWith("C")) {
    i += 2;
    continue;
  }
  if (status === "D") deleted++;
  i++;
}
if (deleted > 20) {
  errors.push(`削除されるファイルが ${deleted} 個あります（20を超えています）。意図したものか、大貫さんの確認が要ります。`);
}

// 2. コミットしてはいけないファイル
const added = git("diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z").split("\0").filter(Boolean);
for (const path of added) {
  for (const [re, label] of FORBIDDEN_PATHS) {
    if (re.test(path)) errors.push(`${path}：${label}はコミットしません。git restore --staged ${path} で外してください。`);
  }
}

// 3. 追加された行の中身
const allow = loadAllowlist();
const names = loadBlockedNames();
// core.quotePath=false にしないと、日本語のファイル名がクォートされた八進数の形になり、中身を見落とすため。
const diff = git("-c", "core.quotePath=false", "diff", "--cached", "-U0", "--no-color", "--no-ext-diff", "--diff-filter=ACMR");
let file = null;
let lineNo = 0;
for (const line of diff.split(/\r?\n/)) {
  if (line.startsWith("+++ ")) {
    // 空白を含むファイル名には末尾に TAB が付き、特殊な文字を含むと「"b/..."」とクォートされる。
    let name = line.slice(4).replace(/\t$/, "");
    if (name.startsWith('"') && name.endsWith('"')) name = name.slice(1, -1);
    file = name.startsWith("b/") ? name.slice(2) : null;
    continue;
  }
  const hunk = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
  if (hunk) {
    lineNo = Number(hunk[1]);
    continue;
  }
  if (!file || !line.startsWith("+")) continue;
  const text = line.slice(1);
  const at = `${file}:${lineNo}`;
  lineNo++;

  for (const name of names) {
    // 名前そのものは出さない（画面やログに残さないため）。
    if (text.includes(name)) errors.push(`${at}：実名の一覧にある名前が入っています。`);
  }
  for (const m of text.match(PHONE) || []) {
    if (!allow.includes(m)) warnings.push(`${at}：電話番号の形「${m}」があります。サイトで出してよいものなら .githooks/content-allowlist.json に足してください。`);
  }
  for (const m of text.match(EMAIL) || []) {
    if (!allow.includes(m)) warnings.push(`${at}：メールアドレスの形「${m}」があります。サイトで出してよいものなら .githooks/content-allowlist.json に足してください。`);
  }
  if (WORD_CHECK_EXEMPT.some((re) => re.test(file))) continue;
  for (const w of OVERCLAIM) {
    if (text.includes(w)) warnings.push(`${at}：言い過ぎの言葉「${w}」があります（CLAUDE.md の内容のルール）。`);
  }
  for (const w of GARDEN) {
    if (text.includes(w)) warnings.push(`${at}：園地の書き方「${w}」があります。「先輩の園地を受け継ぐ」「託してもらう」と書きます。`);
  }
}

// 4. 型・lint
if (!existsSync(join(root, "node_modules"))) {
  warnings.push("node_modules がないため、型と lint のチェックを省略しました（npm ci のあとに動きます）。");
} else {
  const npx = process.platform === "win32" ? "npx.cmd" : "npx";
  for (const args of [["--no-install", "tsc", "--noEmit"], ["--no-install", "next", "lint"]]) {
    const r = spawnSync(npx, args, { cwd: root, encoding: "utf8", shell: process.platform === "win32" });
    if (r.status !== 0) {
      const detail = (r.stdout || "") + (r.stderr || "") + (r.error ? `\n${r.error.message}` : "");
      errors.push(`npx ${args.slice(1).join(" ")} がエラーです（ステージではなく作業ツリー全体を見ています）：\n${detail}`.trim());
    }
  }
}

for (const w of warnings) console.log(`［警告］${w}`);
if (errors.length > 0) {
  for (const e of errors) console.error(`［止めました］${e}`);
  console.error("コミットを止めました（.githooks/precommit-check.mjs）。");
  process.exit(1);
}
process.exit(0);
