"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { quizQuestions } from "@/data/tools/quizData";

// Tool B：補助金クイズ
// 「5問クイズ形式・正解/不正解フィードバック・補助金の概要説明」

export function QuizTool() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = quizQuestions[step];

  function handleSelect(index: number) {
    if (selected !== null) return; // 回答済みなら変更不可
    setSelected(index);
    if (index === question.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  }

  function handleNext() {
    if (step + 1 >= quizQuestions.length) {
      setFinished(true);
      return;
    }
    setStep((s) => s + 1);
    setSelected(null);
  }

  function handleRestart() {
    setStep(0);
    setSelected(null);
    setCorrectCount(0);
    setFinished(false);
  }

  if (finished) {
    const feedback =
      correctCount >= 4
        ? "補助金への理解が高いです。就農シミュレーターで自分の条件に合わせた詳細な試算をしてみましょう。"
        : correctCount >= 2
          ? "農業の補助金制度にはまだ知らないことがあるかもしれません。シミュレーターで実際に計算してみてください。"
          : "農業の補助金制度は意外と充実しています。シミュレーターで自分がいくらもらえるか確認してみてください。";
    return (
      <Card className="text-center">
        <p className="font-mono text-xs font-bold text-green-700">RESULT</p>
        <p className="mt-2 font-serif text-2xl font-bold text-ink">
          {correctCount} / {quizQuestions.length} 問正解
        </p>
        <p className="mt-3 text-left text-sm leading-relaxed text-ink bg-green-50 rounded p-3">{feedback}</p>
        <div className="mt-4 flex justify-center gap-3">
          <Button variant="secondary" onClick={handleRestart}>
            もう一度挑戦する
          </Button>
          <Button href="/simulator">シミュレーターを試す</Button>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex gap-1">
        {quizQuestions.map((q, i) => (
          <div
            key={q.id}
            className={`h-1 flex-1 rounded-full ${
              i < step ? "bg-green-700" : i === step ? "bg-green-400" : "bg-black/10"
            }`}
          />
        ))}
      </div>
      <p className="mt-2 text-sm text-muted">
        Q{step + 1} / {quizQuestions.length}
      </p>
      <Card className="mt-3">
        <p className="font-bold text-ink">{question.question}</p>
        <div className="mt-4 space-y-2">
          {question.options.map((opt, i) => {
            const isSelected = selected === i;
            const isCorrect = i === question.correctIndex;
            let stateClass = "border-green-200 bg-white text-ink hover:bg-green-50";
            if (selected !== null) {
              if (isCorrect) stateClass = "border-green-700 bg-green-50 text-green-700";
              else if (isSelected) stateClass = "border-red bg-[#f7e6e6] text-red";
            }
            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelect(i)}
                className={`block w-full rounded border px-4 py-3 text-left text-sm font-medium transition-colors ${stateClass}`}
              >
                {opt}
                {selected !== null && isCorrect && " ✓"}
                {selected !== null && isSelected && !isCorrect && " ✗"}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div className="mt-4 rounded bg-green-50 p-3 text-sm text-ink">{question.explanation}</div>
        )}

        <div className="mt-4 text-right">
          <Button onClick={handleNext} disabled={selected === null} size="sm">
            {step + 1 >= quizQuestions.length ? "結果を見る" : "次の問題へ"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
