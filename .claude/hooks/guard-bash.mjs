#!/usr/bin/env node
// PreToolUse（Bash・PowerShell）のフック。事故につながる git などのコマンドを止める。
// 止めるときは exit 2 と標準エラーの日本語の説明。警告だけのときは exit 0 で additionalContext を返す。
// スクリプト自体が落ちたら、止める側（exit 2）に倒す。
// 詳しくは docs/INSTRUCTIONS_automation-base.md の「3-3」。
// これはベストエフォート。すり抜けが残る書き方は docs/OPERATIONS.md に書いてある。

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const PROTECTED = new Set(["main", "production"]);

function block(what, why, how) {
  process.stderr.write(
    `【止めました】${what}\n理由：${why}\nどうすればよいか：${how}\n（.claude/hooks/guard-bash.mjs）\n`
  );
  process.exit(2);
}

// コマンドを &&、||、;、|、&、改行、括弧、波括弧、バッククォートで区切る。クォートの中は区切らない。
// リダイレクト（>、<、2>&1 など）とその行き先は単語に含めない。
// 各区切りについて、生の文字列と、クォートを外した単語の列を返す。
function splitSegments(command) {
  const segments = [];
  let raw = "";
  let words = [];
  let word = "";
  let inWord = false;
  let quote = null;
  let skipNextWord = false;
  const pushWord = () => {
    if (inWord) {
      if (skipNextWord) skipNextWord = false;
      else words.push(word);
    }
    word = "";
    inWord = false;
  };
  const pushSegment = () => {
    pushWord();
    skipNextWord = false;
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
    if (c === ">" || c === "<") {
      // 「2>」の 2 のような、リダイレクトの前の数字は単語にしない。
      if (inWord && /^\d+$/.test(word)) {
        word = "";
        inWord = false;
      } else {
        pushWord();
      }
      raw += c;
      // 「>&1」「>>」は、そのまま読み飛ばす。&1 などは行き先として扱う。
      while (command[i + 1] === ">" || command[i + 1] === "&") {
        i++;
        raw += command[i];
      }
      skipNextWord = true;
      continue;
    }
    if (c === "&" || c === "|" || c === ";" || c === "\n" || c === "(" || c === ")" || c === "`" || c === "{" || c === "}") {
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

const basename = (w) => w.replace(/\\/g, "/").split("/").pop().toLowerCase().replace(/\.exe$/, "");
const isAssignment = (w) => /^[A-Za-z_][A-Za-z0-9_]*=/.test(w);
// 前置き（このあとに本当のコマンドが来るもの）と、値を取るオプション。
const PREFIXES = {
  command: "",
  exec: "",
  time: "",
  nohup: "",
  stdbuf: "ioe",
  timeout: "sk",
  nice: "n",
  sudo: "ugCDhprtT",
  env: "uCS",
  xargs: "aEeIiLlnPsd",
  "!": "",
  if: "",
  then: "",
  else: "",
  elif: "",
  do: "",
  while: "",
  until: "",
};

// 先頭の環境変数の代入と、command・sudo・if などの前置きを外す。
function stripPrefixes(words) {
  const env = [];
  const prefixes = [];
  let i = 0;
  while (i < words.length) {
    const w = words[i];
    if (isAssignment(w)) {
      env.push(w);
      i++;
      continue;
    }
    const name = basename(w);
    if (Object.prototype.hasOwnProperty.call(PREFIXES, name)) {
      prefixes.push(name);
      const valueOpts = PREFIXES[name];
      i++;
      // 前置きのオプション（-u X など）を読み飛ばす。timeout の「10」のような最初の数字も飛ばす。
      while (i < words.length && (/^-/.test(words[i]) || (name === "timeout" && /^\d/.test(words[i])))) {
        const opt = words[i];
        i++;
        if (/^-[A-Za-z]$/.test(opt) && valueOpts.includes(opt[1])) i++;
      }
      continue;
    }
    break;
  }
  return { env, prefixes, rest: words.slice(i) };
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

// git は長いオプションの省略（--no-verif など）を受け付けるので、先頭の一致で判定する。
// 「--xx」より短い省略はあいまいで git 自身が断るため、4文字以上を見る。
function longOptIs(arg, full) {
  if (!arg.startsWith("--")) return false;
  const name = arg.split("=")[0];
  return name.length >= 4 && full.startsWith(name);
}

const normalizeRef = (ref) => {
  const r = ref.replace(/^refs\/heads\//, "");
  return r === "@" ? "HEAD" : r;
};

const PUSH_VALUE_OPTS = ["--repo", "--receive-pack", "--exec", "--push-option"];

function checkPush(args, prefixes, warnings) {
  const positional = [];
  if (prefixes.includes("xargs")) {
    block("xargs を使った git push", "送り先がコマンドから読めないため。", "git push は、送り先のブランチ名を書いて直接実行してください。");
  }
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--") {
      positional.push(...args.slice(i + 1));
      break;
    }
    if (
      longOptIs(a, "--force") ||
      longOptIs(a, "--force-with-lease") ||
      longOptIs(a, "--force-if-includes") ||
      shortClusterHas(a, "f", "o")
    ) {
      block("git push の強制（--force など）", "強制 push は履歴を消してしまうため。", "強制せずに、新しいコミットとして push してください。");
    }
    if (longOptIs(a, "--mirror") || longOptIs(a, "--all") || longOptIs(a, "--branches")) {
      block(`git push ${a}`, "main を含むすべてのブランチを送ってしまうため。", "送るブランチを1つ名前で指定してください（main と production 以外）。");
    }
    if (longOptIs(a, "--delete") || shortClusterHas(a, "d", "o")) {
      block("git push でのブランチ削除", "リモートのブランチを消してしまうため。", "削除は大貫さんが GitHub の画面で行います。");
    }
    if (PUSH_VALUE_OPTS.some((o) => longOptIs(a, o)) && !a.includes("=")) {
      i++;
      continue;
    }
    if (a === "-o") {
      i++;
      continue;
    }
    if (a.startsWith("-")) continue;
    positional.push(a);
  }
  if (positional.some((p) => p.includes("$") || p.includes("%"))) {
    block("変数を使った git push", "送り先がコマンドから読めないため。", "送り先のブランチ名を、変数を使わずに書いてください。");
  }
  const refspecs = positional.slice(1);
  const branch = currentBranch();
  if (refspecs.length === 0) {
    if (PROTECTED.has(branch)) {
      block(`今のブランチ（${branch}）での送り先なしの git push`, `${branch} への push は本番公開と同じため。`, "作業用のブランチに切り替えて、そのブランチ名を指定して push してください。");
    }
  }
  for (const spec of refspecs) {
    if (spec.includes("*")) {
      block(`git push ${spec}`, "ワイルドカードの指定では main まで送られてしまうため。", "送るブランチを1つ名前で指定してください。");
    }
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

// git の設定のうち、変えると守りが外れるもの。
const RISKY_CONFIG = /^(core\.hookspath|alias\.|remote\..*\.push|include\.|includeif\.)/i;

function checkGit(words) {
  // git のグローバルオプション（-C <dir>、-c <k=v> など）を飛ばして、サブコマンドを探す。
  let i = 1;
  while (i < words.length && words[i].startsWith("-")) {
    const w = words[i];
    let kv = null;
    if (w === "-c") {
      kv = words[i + 1] || "";
      i += 2;
    } else if (/^-c.+/.test(w)) {
      kv = w.slice(2);
      i++;
    } else if (longOptIs(w, "--config-env")) {
      kv = w.includes("=") ? w.split("=").slice(1).join("=") : words[i + 1] || "";
      i += w.includes("=") ? 1 : 2;
    } else if (w === "-C" || w === "--git-dir" || w === "--work-tree" || w === "--namespace") {
      i += 2;
      continue;
    } else {
      i++;
      continue;
    }
    if (kv !== null && RISKY_CONFIG.test(kv)) {
      block(`git -c ${kv.split("=")[0]}`, "フックや別名、push の送り先の設定を一時的に変えると、守りが外れるため。", "-c で core.hooksPath・alias・remote.*.push を変えずに実行してください。");
    }
  }
  return { sub: words[i], args: words.slice(i + 1) };
}

const OPAQUE_RUNNERS = {
  sh: ["-c"],
  bash: ["-c"],
  zsh: ["-c"],
  dash: ["-c"],
  eval: null,
  powershell: ["-c", "-command", "-encodedcommand", "-e", "-ec"],
  pwsh: ["-c", "-command", "-encodedcommand", "-e", "-ec"],
  cmd: ["/c", "/k"],
  node: ["-e", "--eval", "-p", "--print"],
  python: ["-c"],
  python3: ["-c"],
};

function checkSegment(seg, allSegments, warnings) {
  const { env, prefixes, rest } = stripPrefixes(seg.words);
  if (env.some((e) => /^GIT_CONFIG_(COUNT|KEY_|VALUE_|PARAMETERS|GLOBAL|SYSTEM)/.test(e))) {
    block("GIT_CONFIG_ で始まる環境変数", "git の設定（フックなど）を一時的に変えて、守りを外せてしまうため。", "GIT_CONFIG_ を付けずに実行してください。");
  }
  if (rest.length === 0) {
    if (env.some((e) => e.startsWith("AGRI_BLOCKED_NAMES_FILE="))) {
      // 単独の代入（あとの git commit に効く書き方）は止める。
      block("AGRI_BLOCKED_NAMES_FILE の設定", "実名チェックの一覧を差し替えてしまうため。", "テストは node .githooks/precommit-check.mjs を直接実行するときだけ、その行に付けてください。");
    }
    return;
  }
  const cmd = basename(rest[0]);
  const lowerRest = rest.map((w) => w.toLowerCase());

  if (["export", "set", "declare", "set-item", "$env:agri_blocked_names_file"].includes(cmd) || /^\$env:/i.test(rest[0])) {
    if (seg.raw.includes("AGRI_BLOCKED_NAMES_FILE") || /GIT_CONFIG_/.test(seg.raw)) {
      block("AGRI_BLOCKED_NAMES_FILE・GIT_CONFIG_ の設定", "実名チェックの一覧や git の設定を差し替えてしまうため。", "テストは node .githooks/precommit-check.mjs を直接実行するときだけ、その行に付けてください。");
    }
  }

  // sh -c・bash -c・eval・powershell -c・node -e などの中身は確かめられないので、git push を含めば止める
  //（クォートの中を見る唯一の例外）。
  if (Object.prototype.hasOwnProperty.call(OPAQUE_RUNNERS, cmd)) {
    const flags = OPAQUE_RUNNERS[cmd];
    const runsInline = flags === null || lowerRest.slice(1).some((w) => flags.includes(w));
    if (runsInline && /\bgit\b[\s\S]*\bpush\b/i.test(seg.raw)) {
      block(`${cmd} の中の git push`, "中身を確かめられないため。", "git push は直接実行してください。");
    }
    // 「echo git push ... | sh」のように、パイプでシェルに渡す形。
    if (["sh", "bash", "zsh", "dash", "powershell", "pwsh", "cmd"].includes(cmd) && allSegments.some((s) => /\bgit\b[\s\S]*\bpush\b/i.test(s.raw))) {
      block(`${cmd} に渡す git push`, "中身を確かめられないため。", "git push は直接実行してください。");
    }
  }

  if (cmd === "rm" || cmd === "remove-item" || cmd === "ri" || cmd === "del" || cmd === "rd" || cmd === "rmdir") {
    let recursive = false;
    let force = false;
    for (const a of rest.slice(1)) {
      if (a === "--") break;
      const la = a.toLowerCase();
      if (la === "--recursive" || la === "-recurse" || la === "-r" || la === "/s") recursive = true;
      if (la === "--force" || la === "-force" || la === "/q") force = true;
      if (/^-[A-Za-z]+$/.test(a) && cmd === "rm") {
        if (/[rR]/.test(a)) recursive = true;
        if (/f/.test(a)) force = true;
      }
    }
    if (recursive && force) {
      block(`${rest[0]}（まとめて強制的に消す）`, "まとめて消すと元に戻せないため。", "消すファイルを1つずつ確かめて消すか、大貫さんに確認してください。");
    }
  }

  // PR のマージは本番公開と同じ。ルールセットは承認0なので、ここで止める（マージは大貫さんが GitHub の画面で行う）。
  if (Object.prototype.hasOwnProperty.call(OPAQUE_RUNNERS, cmd) && /(^|[\s"'`;&|(])gh(\.exe)?\s[^;&|]*?(\bpr\s+merge\b|\/merges?\b)/i.test(seg.raw)) {
    block(`${cmd} の中の gh のマージ`, "中身を確かめられないため。", "PR のマージは大貫さんが GitHub の画面で行います。");
  }
  if (cmd === "gh" || cmd === "gh.exe") {
    const prAt = lowerRest.indexOf("pr");
    const isPrMerge = prAt !== -1 && lowerRest[prAt + 1] === "merge";
    const isApiMerge = lowerRest.includes("api") && lowerRest.some((w) => /\/merges?\b/.test(w));
    if (isPrMerge || isApiMerge) {
      block("gh での PR のマージ", "main に入ると本番に公開されるため。", "PR を作るところまでにして、マージは大貫さんが GitHub の画面で行ってください。");
    }
    return;
  }

  if (cmd !== "git") return;
  const { sub, args } = checkGit(rest);
  if (!sub) return;

  if (sub === "push") checkPush(args, prefixes, warnings);

  if (sub === "add" || sub === "stage") {
    let afterDashes = false;
    for (const a of args) {
      if (a === "--") {
        afterDashes = true;
        continue;
      }
      const isDotLike = a === "." || a === "./" || a === ":/" || a === ":" || a === "*" || a === ":/*";
      const isAllOpt =
        !afterDashes &&
        (a === "-A" || a === "-u" || longOptIs(a, "--all") || longOptIs(a, "--update") || shortClusterHas(a, "A") || shortClusterHas(a, "u"));
      if (isDotLike || isAllOpt) {
        block(`git ${sub} ${a}`, "意図しないファイル（大量の削除など）までまとめてステージされるため。", "ファイルを1つずつ指定して git add してください。");
      }
    }
  }

  if (sub === "reset") {
    const hit = args.find((a) => longOptIs(a, "--hard") || longOptIs(a, "--soft"));
    if (hit) {
      block(`git reset ${hit}`, "過去に git reset --soft で大量の削除がステージされかけた事故があるため。--hard は変更を消してしまうため。", "戻したいファイルを git restore で1つずつ戻すか、大貫さんに確認してください。");
    }
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
      if (longOptIs(a, "--no-verify") || shortClusterHas(a, "n", "mFCcStu")) {
        block("git commit --no-verify / -n", "pre-commit のチェックを飛ばしてしまうため。", "チェックを通してコミットしてください。止まった理由は pre-commit の出力にあります。");
      }
      if (["-m", "-F", "-C", "-c", "-t", "--author", "--date", "--file", "--message", "--template", "--reuse-message", "--reedit-message", "--fixup", "--squash", "--cleanup", "--trailer"].includes(a)) {
        j++;
      }
    }
  }

  if (sub === "config") {
    const keyIndex = args.findIndex((a) => RISKY_CONFIG.test(a));
    if (keyIndex >= 0) {
      const key = args[keyIndex];
      const value = args[keyIndex + 1];
      const readOnly = args.some((a) => a === "--get" || a === "--get-all" || a === "--list" || a === "-l" || a === "--get-regexp");
      const unset = args.some((a) => a.startsWith("--unset") || a === "--remove-section");
      const isHooksPath = /^core\.hookspath$/i.test(key);
      if (!readOnly && (unset || (value !== undefined && !(isHooksPath && value === ".githooks")))) {
        block(`git config ${key} の変更`, "フック・別名・push の送り先を変えると、守りが外れるため。", "core.hooksPath は .githooks のままにし、alias・remote.*.push は設定しないでください。");
      }
    }
  }
}

try {
  const input = JSON.parse(readFileSync(0, "utf8"));
  const command = input?.tool_input?.command;
  if (typeof command !== "string") throw new Error("tool_input.command がありません");
  const warnings = [];
  const segments = splitSegments(command);
  for (const seg of segments) checkSegment(seg, segments, warnings);
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
