#!/usr/bin/env node
// PreToolUse（Bash）のフック。事故につながる git などのコマンドを止める。
// 止めるときは exit 2 と標準エラーの日本語の説明。警告だけのときは exit 0 で additionalContext を返す。
// スクリプト自体が落ちたら、止める側（exit 2）に倒す。
// 詳しくは docs/INSTRUCTIONS_automation-base.md の「3-3」。

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const PROTECTED = new Set(["main", "production"]);

function block(what, why, how) {
  process.stderr.write(
    `【止めました】${what}\n理由：${why}\nどうすればよいか：${how}\n（.claude/hooks/guard-bash.mjs）\n`
  );
  process.exit(2);
}

// コマンドを &&、||、;、|、&、改行、括弧、バッククォートで区切る。クォートの中は区切らない。
// 各区切りについて、生の文字列と、クォートを外した単語の列を返す。
function splitSegments(command) {
  const segments = [];
  let raw = "";
  let words = [];
  let word = "";
  let inWord = false;
  let quote = null;
  const pushWord = () => {
    if (inWord) words.push(word);
    word = "";
    inWord = false;
  };
  const pushSegment = () => {
    pushWord();
    if (raw.trim() !== "" || words.length > 0) segments.push({ raw: raw.trim(), words });
    raw = "";
    words = [];
  };
  for (let i = 0; i < command.length; i++) {
    const c = command[i];
    if (quote) {
      raw += c;
      if (c === quote) {
        quote = null;
      } else if (c === "\\" && quote === '"' && i + 1 < command.length) {
        i++;
        raw += command[i];
        word += command[i];
      } else {
        word += c;
      }
      continue;
    }
    if (c === "'" || c === '"') {
      quote = c;
      inWord = true;
      raw += c;
      continue;
    }
    if (c === "\\" && i + 1 < command.length) {
      if (command[i + 1] === "\n") {
        i++;
        continue;
      }
      raw += c + command[i + 1];
      word += command[i + 1];
      inWord = true;
      i++;
      continue;
    }
    if (c === "&" || c === "|" || c === ";" || c === "\n" || c === "(" || c === ")" || c === "`") {
      pushSegment();
      continue;
    }
    if (c === "$" && command[i + 1] === "(") {
      pushSegment();
      i++;
      continue;
    }
    if (c === " " || c === "\t" || c === "\r") {
      pushWord();
      raw += c;
      continue;
    }
    word += c;
    inWord = true;
    raw += c;
  }
  if (quote) throw new Error("クォートが閉じていません");
  pushSegment();
  return segments;
}

const basename = (w) => w.replace(/\\/g, "/").split("/").pop().toLowerCase();
const isAssignment = (w) => /^[A-Za-z_][A-Za-z0-9_]*=/.test(w);
const PREFIXES = new Set(["command", "exec", "time", "nice", "nohup", "sudo", "env", "xargs"]);

// 先頭の環境変数の代入と、command・sudo などの前置きを外す。
function stripPrefixes(words) {
  const env = [];
  let i = 0;
  while (i < words.length) {
    const w = words[i];
    if (isAssignment(w)) {
      env.push(w);
      i++;
    } else if (PREFIXES.has(basename(w))) {
      i++;
    } else if (/^-/.test(w) && i > 0 && PREFIXES.has(basename(words[i - 1]))) {
      i++;
    } else {
      break;
    }
  }
  return { env, rest: words.slice(i) };
}

function currentBranch() {
  if (process.env.AGRI_GUARD_TEST_BRANCH) return process.env.AGRI_GUARD_TEST_BRANCH;
  try {
    return execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

function hasUncommittedChanges() {
  try {
    const out = execFileSync("git", ["status", "--porcelain"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return out.trim() !== "";
  } catch {
    return false;
  }
}

// 「-nm」のような短いオプションのまとまりに、ある文字が含まれるか。
// valueOpts の文字が来たら、その後ろは値なので見ない。
function shortClusterHas(arg, letter, valueOpts = "") {
  if (!/^-[A-Za-z]/.test(arg) || arg.startsWith("--")) return false;
  for (const ch of arg.slice(1)) {
    if (ch === letter) return true;
    if (valueOpts.includes(ch)) return false;
  }
  return false;
}

const normalizeRef = (ref) => ref.replace(/^refs\/heads\//, "");

function checkPush(args, warnings) {
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--") {
      positional.push(...args.slice(i + 1));
      break;
    }
    if (/^--(force|force-with-lease|force-if-includes)(=|$)/.test(a) || shortClusterHas(a, "f", "o")) {
      block("git push の強制（--force など）", "強制 push は履歴を消してしまうため。", "強制せずに、新しいコミットとして push してください。");
    }
    if (a === "--mirror" || a === "--all" || a === "--branches") {
      block(`git push ${a}`, "main を含むすべてのブランチを送ってしまうため。", "送るブランチを1つ名前で指定してください（main と production 以外）。");
    }
    if (a === "--delete" || shortClusterHas(a, "d", "o")) {
      block("git push でのブランチ削除", "リモートのブランチを消してしまうため。", "削除は大貫さんが GitHub の画面で行います。");
    }
    if (a === "--repo" || a === "--receive-pack" || a === "--exec" || a === "-o" || a === "--push-option") {
      i++;
      continue;
    }
    if (a.startsWith("-")) continue;
    positional.push(a);
  }
  const refspecs = positional.slice(1);
  const branch = currentBranch();
  if (refspecs.length === 0) {
    if (PROTECTED.has(branch)) {
      block(`今のブランチ（${branch}）での送り先なしの git push`, `${branch} への push は本番公開と同じため。`, "作業用のブランチに切り替えて、そのブランチ名を指定して push してください。");
    }
  }
  for (const spec of refspecs) {
    if (spec.startsWith("+")) {
      block(`git push ${spec}`, "先頭の + は強制 push になるため。", "+ を付けずに push してください。");
    }
    if (spec.startsWith(":")) {
      block(`git push ${spec}`, "リモートのブランチを消してしまうため。", "削除は大貫さんが GitHub の画面で行います。");
    }
    const parts = spec.split(":");
    const src = normalizeRef(parts[0]);
    const dst = normalizeRef(parts.length > 1 ? parts[parts.length - 1] : parts[0]);
    if (PROTECTED.has(dst)) {
      block(`git push の送り先が ${dst}`, `${dst} への push は本番公開と同じため。`, "作業用のブランチに push し、PR を作って大貫さんにマージしてもらってください。");
    }
    if (parts.length === 1 && src === "HEAD" && PROTECTED.has(branch)) {
      block(`今のブランチ（${branch}）での git push ... HEAD`, `${branch} への push は本番公開と同じため。`, "作業用のブランチに切り替えてから push してください。");
    }
  }
  if (hasUncommittedChanges()) {
    warnings.push("コミットしていない変更があります。push されるのはコミット済みの分だけです。");
  }
}

function checkGit(words, env) {
  // git のグローバルオプション（-C <dir>、-c <k=v> など）を飛ばして、サブコマンドを探す。
  let i = 1;
  while (i < words.length && words[i].startsWith("-")) {
    const w = words[i];
    if (w === "-c") {
      const kv = words[i + 1] || "";
      if (/^core\.hookspath/i.test(kv)) {
        block("git -c core.hooksPath=...", "pre-commit のチェックを外してしまうため。", "-c core.hooksPath を付けずに実行してください。");
      }
      i += 2;
      continue;
    }
    if (/^-c.+/.test(w) && /core\.hookspath/i.test(w)) {
      block("git -c core.hooksPath=...", "pre-commit のチェックを外してしまうため。", "-c core.hooksPath を付けずに実行してください。");
    }
    if (w === "-C" || w === "--git-dir" || w === "--work-tree" || w === "--namespace") {
      i += 2;
      continue;
    }
    i++;
  }
  const sub = words[i];
  const args = words.slice(i + 1);
  return { sub, args };
}

function checkSegment(seg, warnings) {
  const { env, rest } = stripPrefixes(seg.words);
  if (rest.length === 0) {
    if (env.some((e) => e.startsWith("AGRI_BLOCKED_NAMES_FILE="))) {
      // 単独の代入（あとの git commit に効く書き方）は止める。
      block("AGRI_BLOCKED_NAMES_FILE の設定", "実名チェックの一覧を差し替えてしまうため。", "テストは node .githooks/precommit-check.mjs を直接実行するときだけ、その行に付けてください。");
    }
    return;
  }
  const cmd = basename(rest[0]).replace(/\.exe$/, "");

  if ((cmd === "export" || cmd === "set" || cmd === "declare") && rest.some((w) => w.startsWith("AGRI_BLOCKED_NAMES_FILE"))) {
    block("AGRI_BLOCKED_NAMES_FILE の設定", "実名チェックの一覧を差し替えてしまうため。", "テストは node .githooks/precommit-check.mjs を直接実行するときだけ、その行に付けてください。");
  }

  // sh -c・bash -c・eval の中身は確かめられないので、git push を含めば止める（クォートの中を見る唯一の例外）。
  if (["sh", "bash", "zsh", "dash", "eval"].includes(cmd)) {
    if (/\bgit\b[\s\S]*\bpush\b/.test(seg.raw)) {
      block(`${cmd} の中の git push`, "中身を確かめられないため。", "git push は直接実行してください。");
    }
  }

  if (cmd === "rm") {
    let recursive = false;
    let force = false;
    for (const a of rest.slice(1)) {
      if (a === "--") break;
      if (a === "--recursive") recursive = true;
      else if (a === "--force") force = true;
      else if (/^-[A-Za-z]+$/.test(a)) {
        if (/[rR]/.test(a)) recursive = true;
        if (/f/.test(a)) force = true;
      }
    }
    if (recursive && force) {
      block("rm -rf", "まとめて消すと元に戻せないため。", "消すファイルを1つずつ確かめて消すか、大貫さんに確認してください。");
    }
  }

  if (cmd !== "git") return;
  const { sub, args } = checkGit(rest, env);
  if (!sub) return;

  if (sub === "push") checkPush(args, warnings);

  if (sub === "add") {
    for (const a of args) {
      if (a === "--") break;
      if (a === "-A" || a === "--all" || a === "-u" || a === "--update" || a === "." || a === "./" || shortClusterHas(a, "A") || shortClusterHas(a, "u")) {
        block(`git add ${a}`, "意図しないファイル（大量の削除など）までまとめてステージされるため。", "ファイルを1つずつ指定して git add してください。");
      }
    }
  }

  if (sub === "reset" && args.some((a) => a === "--hard" || a === "--soft")) {
    block(`git reset ${args.find((a) => a === "--hard" || a === "--soft")}`, "過去に git reset --soft で大量の削除がステージされかけた事故があるため。--hard は変更を消してしまうため。", "戻したいファイルを git restore で1つずつ戻すか、大貫さんに確認してください。");
  }

  if (sub === "clean") {
    block("git clean", "管理していないファイル（引き継ぎの資料など）を消してしまうため。", "消すファイルを1つずつ確かめてください。");
  }

  if (sub === "commit") {
    if (env.some((e) => e.startsWith("AGRI_BLOCKED_NAMES_FILE="))) {
      block("AGRI_BLOCKED_NAMES_FILE を付けた git commit", "実名チェックの一覧を差し替えてしまうため。", "付けずにコミットしてください。");
    }
    for (let j = 0; j < args.length; j++) {
      const a = args[j];
      if (a === "--") break;
      if (a === "--no-verify" || shortClusterHas(a, "n", "mFCcSt")) {
        block("git commit --no-verify / -n", "pre-commit のチェックを飛ばしてしまうため。", "チェックを通してコミットしてください。止まった理由は pre-commit の出力にあります。");
      }
      if (["-m", "-F", "-C", "-c", "-t", "--author", "--date", "--file", "--message", "--template", "--reuse-message", "--reedit-message", "--fixup", "--squash", "--cleanup", "--trailer"].includes(a)) {
        j++;
      }
    }
  }

  if (sub === "config") {
    const keyIndex = args.findIndex((a) => /^core\.hookspath$/i.test(a));
    if (keyIndex >= 0) {
      const value = args[keyIndex + 1];
      const unset = args.some((a) => a.startsWith("--unset") || a === "--remove-section");
      if (unset || (value !== undefined && value !== ".githooks")) {
        block("git config core.hooksPath の変更", "pre-commit のチェックを外してしまうため。", "core.hooksPath は .githooks のままにしてください。");
      }
    }
  }
}

try {
  const input = JSON.parse(readFileSync(0, "utf8"));
  const command = input?.tool_input?.command;
  if (typeof command !== "string") throw new Error("tool_input.command がありません");
  const warnings = [];
  for (const seg of splitSegments(command)) checkSegment(seg, warnings);
  if (warnings.length > 0) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          additionalContext: warnings.join("\n"),
        },
      })
    );
  }
  process.exit(0);
} catch (e) {
  process.stderr.write(`【止めました】フックがコマンドを確かめられませんでした（${e && e.message ? e.message : e}）。止める側に倒しています。（.claude/hooks/guard-bash.mjs）\n`);
  process.exit(2);
}
