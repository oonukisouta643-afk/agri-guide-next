"use client";

import { useState } from "react";
import type { Question } from "@/lib/simulator/questions";
import type { SimulatorAction, SimulatorMachineState } from "@/lib/simulator/reducer";
import { calcCropCoverage, calcIncomeCoverPercent } from "@/lib/simulator/calculations";
import type { CropKey } from "@/lib/simulator/types";

// シミュレーターの質問ステップ（Q1〜Q10）
// 出典：AgriGuide_Next移行_要件定義書v2.0 §6／agri-simulator-v4.html（旧版）の質問画面UIを移植
// - 選択ボタン：全幅（モバイル）・2カラム（一部）・選択済みはgreen-700背景・白文字
// - 各選択肢に絵文字アイコンを表示（旧版.oi/.ci相当）
// - 戻るボタン：左下・テキストボタン／次へボタン：右下・disabled状態は灰色
// - 品目未選択で次へ進もうとした場合：「少なくとも1つ選択してください」のトースト
// - Q9で不安・時期の片方だけ選んだ場合：次へボタンはdisabled

type QuestionStepProps = {
  question: Question;
  machine: SimulatorMachineState;
  dispatch: React.Dispatch<SimulatorAction>;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
};

function OptionButton({
  label,
  icon,
  sub,
  selected,
  onClick,
}: {
  label: string;
  icon?: string;
  sub?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`w-full rounded border px-4 py-3 text-center text-sm font-medium leading-snug transition-colors duration-150 ${
        selected
          ? "border-green-700 bg-green-700 text-white"
          : "border-green-200 bg-white text-ink hover:bg-green-50"
      }`}
    >
      {icon && <span className="mb-1 block text-2xl leading-none">{icon}</span>}
      <span className="block">{label}</span>
      {sub && (
        <span className={`mt-1 block text-xs ${selected ? "text-green-100" : "text-muted"}`}>
          {sub}
        </span>
      )}
    </button>
  );
}

// 旧版.hint-band（Q3・居住地の質問に付随するSNS情報収集バー）の移植
function HintBand() {
  const icons: { label: string; bg: string }[] = [
    { label: "L", bg: "#00B900" },
    { label: "▣", bg: "linear-gradient(45deg,#f09433,#dc2743)" },
    { label: "𝕏", bg: "#000000" },
    { label: "▶", bg: "#FF0000" },
  ];
  return (
    <div className="mb-4 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
      <p className="flex-1 text-xs text-green-700">情報収集はどこで？</p>
      <div className="flex gap-2">
        {icons.map((ic, i) => (
          <span
            key={i}
            className="flex h-7 w-7 items-center justify-center rounded text-xs font-bold text-white"
            style={{ background: ic.bg }}
          >
            {ic.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function QuestionStep({
  question,
  machine,
  dispatch,
  onNext,
  onBack,
  isFirst,
}: QuestionStepProps) {
  const [showCropWarning, setShowCropWarning] = useState(false);
  const { answers } = machine;

  let canProceed = false;
  if (question.kind === "single") {
    canProceed = Boolean(answers[question.key]);
  } else if (question.kind === "multi") {
    // 品目（複数選択）は常にボタンを有効にし、未選択のままクリックした場合は
    // handleNext側で警告を表示する（ボタンをdisabledにすると警告を出す手段がなくなるため）。
    canProceed = true;
  } else if (question.kind === "capIncome") {
    canProceed = Boolean(answers.cap);
  } else {
    canProceed = Boolean(answers.worry) && Boolean(answers.timing);
  }

  function handleNext() {
    if (question.kind === "multi" && answers.crops.length === 0) {
      setShowCropWarning(true);
      return;
    }
    setShowCropWarning(false);
    onNext();
  }

  return (
    <div
      key={question.step}
      role="group"
      aria-live="polite"
      className="animate-[slideIn_0.3s_ease-out] rounded-lg border border-green-200 bg-white p-6 shadow"
    >
      <h2 className="text-center text-lg font-bold text-ink">{question.title}</h2>
      {question.subtitle && (
        <p className="mt-2 text-center text-sm leading-relaxed text-muted">{question.subtitle}</p>
      )}

      {question.kind === "single" && (
        <>
          {question.hintBand && (
            <div className="mt-4">
              <HintBand />
            </div>
          )}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {question.options.map((opt) => (
              <OptionButton
                key={opt.value}
                label={opt.label}
                icon={opt.icon}
                sub={opt.sub}
                selected={answers[question.key] === opt.value}
                onClick={() =>
                  dispatch({ type: "SET_SINGLE", key: question.key, value: opt.value })
                }
              />
            ))}
          </div>
        </>
      )}

      {question.kind === "multi" && (
        <>
          <div className="mt-6 space-y-5">
            {question.groups.map((group) => (
              <div key={group.label}>
                <p className="mb-2 text-xs font-bold text-green-700">
                  {group.icon} {group.label}
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {group.options.map((opt) => (
                    <OptionButton
                      key={opt.value}
                      label={opt.label}
                      icon={opt.icon}
                      selected={answers.crops.includes(opt.value as never)}
                      onClick={() => {
                        setShowCropWarning(false);
                        dispatch({ type: "TOGGLE_CROP", value: opt.value });
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {showCropWarning && (
            <p role="alert" className="mt-3 text-center text-sm font-bold text-red">
              少なくとも1つ選択してください
            </p>
          )}
          {(() => {
            const coverage = calcCropCoverage(answers.crops as CropKey[]);
            return (
              <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                <p className="mb-2 text-xs font-bold text-green-700">🌿 福島県北6地域との照合</p>
                <p className="text-xs leading-relaxed text-ink">{coverage.message}</p>
              </div>
            );
          })()}
        </>
      )}

      {question.kind === "capIncome" && (
        <div className="mt-6 space-y-6">
          <div>
            <p className="mb-2 text-sm font-bold text-muted">{question.incomeLabel}</p>
            <p className="text-center font-serif text-4xl font-black leading-none text-green-700">
              {answers.income >= question.incomeMax
                ? `${question.incomeMax}万円以上`
                : `${answers.income}万円`}
            </p>
            <p className="mb-3 mt-1 text-center text-xs text-muted">
              補助金カバー率 →{" "}
              <span className="font-bold text-green-700">
                {calcIncomeCoverPercent(answers.income)}%
              </span>
            </p>
            <input
              type="range"
              min={question.incomeMin}
              max={question.incomeMax}
              step={question.incomeStep}
              value={answers.income}
              onChange={(e) => dispatch({ type: "SET_INCOME", value: Number(e.target.value) })}
              className="w-full accent-green-700"
              aria-label={question.incomeLabel}
            />
            <div className="mt-1 flex justify-between text-xs text-muted">
              <span>{question.incomeMin}万円</span>
              <span>{question.incomeMax}万円+</span>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-bold text-muted">{question.capLabel}</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {question.options.map((opt) => (
                <OptionButton
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  selected={answers.cap === opt.value}
                  onClick={() => dispatch({ type: "SET_SINGLE", key: "cap", value: opt.value })}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {question.kind === "dual" && (
        <div className="mt-6 space-y-6">
          <div>
            <p className="text-sm font-bold text-muted">{question.worryLabel}</p>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {question.worryOptions.map((opt) => (
                <OptionButton
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  selected={answers.worry === opt.value}
                  onClick={() => dispatch({ type: "SET_WORRY", value: opt.value })}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-muted">{question.timingLabel}</p>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {question.timingOptions.map((opt) => (
                <OptionButton
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  selected={answers.timing === opt.value}
                  onClick={() => dispatch({ type: "SET_TIMING", value: opt.value })}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        {!isFirst ? (
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-medium text-muted hover:text-ink"
          >
            ← 戻る
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed}
          className={`rounded px-6 py-3 text-sm font-bold transition-colors ${
            canProceed
              ? "bg-green-700 text-white hover:bg-green-600"
              : "cursor-not-allowed bg-green-200 text-white"
          }`}
        >
          次へ →
        </button>
      </div>
    </div>
  );
}
