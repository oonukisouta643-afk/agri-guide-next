"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { WarningBox } from "@/components/ui/WarningBox";
import { calendarCrops, getCalendarCrop, type CalendarCropKey } from "@/data/tools/calendarData";

// Tool A：農業カレンダー（品目から住む場所を考える）
// 旧サイト（agri-tools.html 141-187, 430-509, 588-635行）の4ステップ・ウィザードを移植。
// STEP1 品目選択 → STEP2 産地情報 → STEP3 カレンダー+生活 → STEP4 収入安定化提案

const monthLabels = Array.from({ length: 12 }, (_, i) => `${i + 1}月`);

const typeStyles: Record<string, { bg: string; icon: string }> = {
  harvest: { bg: "border-gold bg-[#fbf3e3]", icon: "💰" },
  busy: { bg: "border-green-400 bg-green-100", icon: "🔥" },
  work: { bg: "border-green-200 bg-green-50", icon: "🌿" },
  "": { bg: "border-green-100 bg-white", icon: "" },
};

const fitColor: Record<string, string> = {
  high: "text-green-700",
  mid: "text-muted",
  low: "text-gold",
};

function BarGauge({ label, months, colorClass }: { label: string; months: number; colorClass: string }) {
  const pct = Math.round((months / 12) * 100);
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs text-muted">{label}</span>
        <span className="font-mono text-sm font-bold text-green-700">{months}ヶ月</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-black/5">
        <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function CalendarTool() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [cropKey, setCropKey] = useState<CalendarCropKey | null>(null);

  const crop = cropKey ? getCalendarCrop(cropKey) : null;

  function selectCrop(key: CalendarCropKey) {
    setCropKey(key);
    setStep(2);
  }

  function BackButton({ to }: { to: 1 | 2 | 3 }) {
    return (
      <button
        type="button"
        onClick={() => setStep(to)}
        className="mr-2 rounded-full border border-black/10 px-3 py-1 text-xs text-muted hover:bg-green-50"
      >
        ← 戻る
      </button>
    );
  }

  return (
    <div>
      <p className="text-sm leading-relaxed text-muted">
        「農業に興味はあるけど、何を作るかも、どこに住むかも決まっていない」——そんな方のための入口です。なんとなく気になる品目から選んでみてください。
      </p>

      {/* STEP 1: 品目選択 */}
      {step === 1 && (
        <div className="mt-5">
          <p className="mb-2 text-xs font-bold text-ink">STEP 1　気になる品目を選んでください（なんとなくでOK）</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {calendarCrops.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => selectCrop(c.key)}
                className="rounded border border-black/10 bg-white p-3 text-left transition-colors hover:border-green-400 hover:bg-green-50"
              >
                <div className="text-2xl">{c.emoji}</div>
                <div className="mt-1 text-sm font-bold text-ink">{c.label}</div>
                <div className={`text-[10px] font-bold ${fitColor[c.fitLevel]}`}>{c.fit.split(" ")[0]}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: 産地情報 */}
      {step === 2 && crop && (
        <div className="mt-5">
          <div className="mb-3 flex items-center">
            <BackButton to={1} />
            <p className="text-xs font-bold text-ink">STEP 2　福島県北での産地情報</p>
          </div>
          <Card>
            <div className="flex items-start gap-3">
              <div className="text-4xl">{crop.emoji}</div>
              <div className="flex-1">
                <p className="font-bold text-ink">{crop.label}</p>
                <p className={`text-xs font-bold ${fitColor[crop.fitLevel]}`}>{crop.fit}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{crop.areaNote}</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded bg-green-50 p-2.5">
                <p className="text-[10px] text-muted">初期費用目安</p>
                <p className="text-xs font-bold text-ink">{crop.cost}</p>
                <p className="text-[9px] text-muted">※仮データ</p>
              </div>
              <div className="rounded bg-green-50 p-2.5">
                <p className="text-[10px] text-muted">黒字化の目安</p>
                <p className="text-xs font-bold text-ink">{crop.bep}</p>
                <p className="text-[9px] text-muted">※仮データ</p>
              </div>
            </div>
          </Card>
          <Card className="mt-3 border-green-200 bg-green-50">
            <p className="mb-1.5 text-xs font-bold text-green-700">📍 主な産地エリア（福島県北）</p>
            <p className="text-sm font-bold text-ink">{crop.productionAreas.join("・")}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">{crop.life}</p>
            <p className="mt-2.5 rounded bg-white p-2.5 text-[11px] text-gold">
              ⚠️ 産地データは2026年8月の農家ヒアリング後に実数値で更新予定。現在は概算です。
            </p>
          </Card>
          <button
            type="button"
            onClick={() => setStep(3)}
            className="mt-3 w-full rounded bg-green-700 py-3 text-sm font-bold text-white hover:bg-green-600"
          >
            1年間のカレンダーを見る →
          </button>
        </div>
      )}

      {/* STEP 3: カレンダー + 生活 */}
      {step === 3 && crop && (
        <div className="mt-5">
          <div className="mb-3 flex items-center">
            <BackButton to={2} />
            <p className="text-xs font-bold text-ink">STEP 3　1年間の仕事と生活</p>
          </div>
          <div className="grid grid-cols-6 gap-1">
            {crop.cal.map((m) => {
              const s = typeStyles[m.type];
              return (
                <div key={m.month} className={`rounded-lg border p-1.5 text-center ${s.bg}`}>
                  <div className="text-[9px] font-bold text-muted">{monthLabels[m.month - 1]}</div>
                  <div className="mb-0.5 text-sm">{s.icon}</div>
                  <div className="text-[8px] leading-tight text-muted">{m.label}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-muted">
            <span>💰 収穫・出荷</span>
            <span>🔥 繁忙期</span>
            <span>🌿 作業期</span>
          </div>
          <Card className="mt-3">
            <p className="mb-2 text-xs font-bold text-ink">🏡 生活環境のポイント</p>
            <p className="text-sm leading-relaxed text-muted">{crop.life}</p>
          </Card>
          <button
            type="button"
            onClick={() => setStep(4)}
            className="mt-3 w-full rounded bg-green-700 py-3 text-sm font-bold text-white hover:bg-green-600"
          >
            収入を安定させるには？ →
          </button>
        </div>
      )}

      {/* STEP 4: 収入安定化提案 */}
      {step === 4 && crop && (
        <div className="mt-5">
          <div className="mb-3 flex items-center">
            <BackButton to={3} />
            <p className="text-xs font-bold text-ink">STEP 4　収入を安定させるには</p>
          </div>

          {(() => {
            const harvestMonths = crop.cal.filter((m) => m.type === "harvest").length;
            const addCrops = crop.add.map((k) => getCalendarCrop(k));
            const afterAdd = Math.min(
              12,
              harvestMonths + addCrops.reduce((sum, c) => sum + c.cal.filter((m) => m.type === "harvest").length, 0)
            );
            return (
              <>
                <Card>
                  <p className="mb-2 text-xs font-bold text-ink">まずは{crop.label}1品目から</p>
                  <BarGauge label="収入が入る月" months={harvestMonths} colorClass="bg-green-600" />
                </Card>
                <Card className="mt-3 border-green-200 bg-gradient-to-br from-green-50 to-green-100">
                  <p className="mb-1.5 text-xs font-bold text-green-700">ゆくゆく{crop.addName}を追加すると</p>
                  <p className="mb-2.5 text-sm leading-relaxed text-ink">{crop.addReason}</p>
                  <BarGauge label="収入が入る月（合計）" months={afterAdd} colorClass="bg-green-600" />
                  <p className="mt-1.5 text-xs text-green-700">
                    追加品目：{addCrops.map((c) => c.label).join("・")}
                  </p>
                </Card>
                <Card className="mt-3 text-xs leading-relaxed text-muted">
                  💡
                  最初から複数品目を始める必要はありません。まず1品目で経営を軌道に乗せてから、少しずつ追加していくのが現実的です。シミュレーターで具体的な資金計画を確認してみてください。
                </Card>
              </>
            );
          })()}

          <WarningBox type="warn" className="mt-3">
            ⚠️ 仮データです。産地・品目情報は2026年8月の農家ヒアリング後に更新予定。
          </WarningBox>

          <Link
            href="/simulator"
            className="mt-3 block w-full rounded bg-green-700 py-3 text-center text-sm font-bold text-white hover:bg-green-600"
          >
            🌿 シミュレーターで詳しく計算する →
          </Link>
        </div>
      )}
    </div>
  );
}
