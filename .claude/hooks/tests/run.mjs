#!/usr/bin/env node
// guard-bash.mjs のテストをまとめて流す。
// 各テストは同じフォルダの *.json（フックへの入力そのもの）。期待する exit と今のブランチは cases.json に書く。
// 使い方：node .claude/hooks/tests/run.mjs

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const guard = join(here, "..", "guard-bash.mjs");
const cases = JSON.parse(readFileSync(join(here, "cases.json"), "utf8"));

let failed = 0;
console.log("| 入力 | 今のブランチ | 期待 | 結果 |");
console.log("|---|---|---|---|");
for (const c of cases) {
  const input = readFileSync(join(here, c.file), "utf8");
  const env = { ...process.env, AGRI_GUARD_TEST_BRANCH: c.branch || "automation-base" };
  const r = spawnSync(process.execPath, [guard], { input, env, encoding: "utf8" });
  const ok = r.status === c.expect;
  if (!ok) failed++;
  let shown;
  try {
    shown = JSON.parse(input).tool_input.command;
  } catch {
    shown = "（壊れた JSON）";
  }
  console.log(`| \`${shown.replace(/\|/g, "\\|")}\` | ${c.branch || "automation-base"} | exit ${c.expect} | exit ${r.status}${ok ? "" : " ← 違う"} |`);
}
console.log(failed === 0 ? "\nすべて期待どおり" : `\n期待と違う：${failed} 件`);
process.exit(failed === 0 ? 0 : 1);
