"use client";

import { useState } from "react";
import type { Question } from "@/lib/simulator/questions";
import type { SimulatorAction, SimulatorMachineState } from "@/lib/simulator/reducer";

// シミュレーターの質問ステップ（Q1〜Q10）
// 出典：AgriGuide_Next移行_要件定義書v2.0 §6
// - 選択ボタン：全幅（モバイル）・2カラム（一部）・選択済みはgreen-700背景・白文字
// - 戻るボタン：左下・テキストボタン／次へボタン：右下・disabled状態は灰色
// - ステップ遷移アニメーション：右からスライドイン0.3s
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
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`w-full rounded border px-4 py-3 text-left text-sm font-medium transition-colors duration-150 ${
        selected
          ? "border-green-700 bg-green-700 text-white"
          : "border-green-200 bg-white text-ink hover:bg-green-50"
      }`}
    >
      {label}
    </button>
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

      {question.kind === "single" && (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {question.options.map((opt) => (
            <OptionButton
              key={opt.value}
              label={opt.label}
              selected={answers[question.key] === opt.value}
              onClick={() =>
                dispatch({ type: "SET_SINGLE", key: question.key, value: opt.value })
              }
            />
          ))}
        </div>
      )}

      {question.kind === "multi" && (
        <>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {question.options.map((opt) => (
              <OptionButton
                key={opt.value}
                label={opt.label}
                selected={answers.crops.includes(opt.value as never)}
                onClick={() => {
                  setShowCropWarning(false);
                  dispatch({ type: "TOGGLE_CROP", value: opt.value });
                }}
              />
            ))}
          </div>
          {showCropWarning && (
            <p role="alert" className="mt-3 text-center text-sm font-bold text-red">
              少なくとも1つ選択してください
            </p>
          )}
        </>
      )}

      {question.kind === "dual" && (
        <div className="mt-6 space-y-6">
          <div>
            <p className="text-sm font-bold text-muted">不安なこと</p>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {question.worryOptions.map((opt) => (
                <OptionButton
                  key={opt.value}
                  label={opt.label}
                  selected={answers.worry === opt.value}
                  onClick={() => dispatch({ type: "SET_WORRY", value: opt.value })}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-muted">就農時期</p>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {question.timingOptions.map((opt) => (
                <OptionButton
                  key={opt.value}
                  label={opt.label}
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
