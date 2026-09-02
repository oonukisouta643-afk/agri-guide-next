"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  aptitudeQuestions,
  aptitudeResultText,
  aptitudeScoreColorClass,
  APTITUDE_SCALE_MIN_LABEL,
  APTITUDE_SCALE_MAX_LABEL,
  APTITUDE_SCALE_VALUES,
} from "@/data/tools/aptitudeData";

// Tool D：農業適性チェック
// 「5問・農業という生き方との相性スコア表示」
// 旧サイト（agri-tools.html 94-112, 798-859行）の5段階リッカート尺度・進捗バー・
// 72pxの大きなスコア表示・シミュレーターへのリンクを移植。

export function AptitudeTool() {
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(aptitudeQuestions.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);

  const answeredCount = answers.filter((a) => a !== null).length;
  const allAnswered = answers.every((a) => a !== null);
  const totalScore = answers.reduce((sum: number, a) => sum + (a ?? 0), 0);
  const maxScore = aptitudeQuestions.length * 5;
  const progressPct = submitted ? 100 : Math.round((answeredCount / aptitudeQuestions.length) * 100);

  function handleSelect(qIndex: number, score: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = score;
      return next;
    });
  }

  function handleReset() {
    setAnswers(Array(aptitudeQuestions.length).fill(null));
    setSubmitted(false);
  }

  const scorePct = Math.round((totalScore / maxScore) * 100);

  return (
    <div>
      <p className="text-sm leading-relaxed text-muted">
        5つの質問に答えてください。「農業に向いているか」より「農業という生き方がどのくらい自分に近いか」を確認するためのチェックです。
      </p>

      {/* 進捗バー */}
      <div className="mt-4 h-[5px] overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs text-muted">
        {submitted ? aptitudeQuestions.length : answeredCount} / {aptitudeQuestions.length} 問回答済み
      </p>

      {submitted ? (
        <Card className="mt-4 text-center">
          <p className={`font-serif text-[72px] font-black leading-none ${aptitudeScoreColorClass(scorePct)}`}>
            {scorePct}%
          </p>
          <p className="mb-4 mt-1 text-sm text-muted">農業という生き方との親和性</p>
          {(() => {
            const result = aptitudeResultText(totalScore, maxScore);
            return (
              <div className="rounded border-l-[3px] border-green-400 bg-green-50 p-4 text-left text-sm leading-relaxed text-ink">
                <p className="font-bold text-ink">{result.title}</p>
                <p className="mt-1.5">{result.description}</p>
              </div>
            );
          })()}
          <p className="mt-3 text-xs text-muted">
            スコア：{totalScore} / {maxScore}（※この診断は目安であり、断定的な適性判定ではありません）
          </p>
          <div className="mt-4 flex flex-col items-center gap-3">
            <Button variant="secondary" onClick={handleReset}>
              もう一度やってみる
            </Button>
            <Link
              href="/simulator"
              className="block w-full rounded bg-green-700 py-3 text-center text-sm font-bold text-white hover:bg-green-600"
            >
              🌿 就農シミュレーターを試す
            </Link>
          </div>
        </Card>
      ) : (
        <div className="mt-4 space-y-4">
          {aptitudeQuestions.map((q, qIndex) => (
            <Card key={q.id}>
              <p className="font-mono text-[10px] tracking-wide text-green-600">
                質問 {qIndex + 1} / {aptitudeQuestions.length}
              </p>
              <p className="mt-1.5 font-bold text-ink">{q.question}</p>
              <div className="mt-3 flex gap-2">
                {APTITUDE_SCALE_VALUES.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleSelect(qIndex, v)}
                    className={`flex-1 rounded border-2 py-3 text-center text-sm font-bold transition-colors ${
                      answers[qIndex] === v
                        ? "border-green-600 bg-green-50 text-green-700"
                        : "border-black/10 bg-white text-muted hover:border-green-400"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="mt-1.5 flex justify-between text-[10px] text-muted">
                <span>{APTITUDE_SCALE_MIN_LABEL}</span>
                <span>{APTITUDE_SCALE_MAX_LABEL}</span>
              </div>
            </Card>
          ))}
          <div className="text-center">
            <Button onClick={() => setSubmitted(true)} disabled={!allAnswered}>
              診断結果を見る
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
