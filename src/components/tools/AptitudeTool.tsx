"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { aptitudeQuestions, aptitudeResultText } from "@/data/tools/aptitudeData";

// Tool D：農業適性チェック
// 「5問・農業という生き方との相性スコア表示」

export function AptitudeTool() {
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(aptitudeQuestions.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = answers.every((a) => a !== null);
  const totalScore = answers.reduce((sum: number, a) => sum + (a ?? 0), 0);
  const maxScore = aptitudeQuestions.length * 3;

  function handleSelect(qIndex: number, score: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = score;
      return next;
    });
  }

  if (submitted) {
    const result = aptitudeResultText(totalScore, maxScore);
    return (
      <Card className="text-center">
        <p className="font-mono text-xs font-bold text-green-700">RESULT</p>
        <p className="mt-2 font-serif text-xl font-bold text-ink">{result.title}</p>
        <p className="mt-3 text-sm text-ink">{result.description}</p>
        <p className="mt-4 text-xs text-muted">
          スコア：{totalScore} / {maxScore}（※この診断は目安であり、断定的な適性判定ではありません）
        </p>
        <div className="mt-4">
          <Button
            variant="secondary"
            onClick={() => {
              setAnswers(Array(aptitudeQuestions.length).fill(null));
              setSubmitted(false);
            }}
          >
            もう一度診断する
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {aptitudeQuestions.map((q, qIndex) => (
        <Card key={q.id}>
          <p className="font-bold text-ink">{q.question}</p>
          <div className="mt-3 space-y-2">
            {q.options.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => handleSelect(qIndex, opt.score)}
                className={`block w-full rounded border px-4 py-3 text-left text-sm font-medium transition-colors ${
                  answers[qIndex] === opt.score
                    ? "border-green-700 bg-green-700 text-white"
                    : "border-green-200 bg-white text-ink hover:bg-green-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Card>
      ))}
      <div className="text-center">
        <Button onClick={() => setSubmitted(true)} disabled={!allAnswered}>
          診断結果を見る
        </Button>
      </div>
    </div>
  );
}
