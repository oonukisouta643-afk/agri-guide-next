"use client";

import { useEffect, useReducer, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ProgressBar } from "@/components/simulator/ProgressBar";
import { QuestionStep } from "@/components/simulator/QuestionStep";
import { ResultScreen } from "@/components/simulator/ResultScreen";
import { simulatorReducer, initialMachineState } from "@/lib/simulator/reducer";
import { decodeParamToState } from "@/lib/simulator/calculations";
import { questions } from "@/lib/simulator/questions";
import { TOTAL_QUESTIONS } from "@/lib/simulator/types";
import { isNotifyEnabled } from "@/lib/simulator/notify";

// 就農シミュレーターのメイン画面
// 出典：AgriGuide_Next移行_要件定義書v2.0 §6
// URLパラメータ（?sim=...）があれば回答を復元して結果を直接表示する（F-30・F-36）

export function SimulatorApp() {
  const [machine, dispatch] = useReducer(simulatorReducer, initialMachineState);
  const searchParams = useSearchParams();
  const router = useRouter();
  // 共有用URLで開いた結果か（運営者への通知は、ここで10問に答えた結果だけにするため）
  const [fromShare, setFromShare] = useState(false);

  useEffect(() => {
    const param = searchParams.get("sim");
    if (!param) return;
    const restored = decodeParamToState(param);
    if (restored) {
      dispatch({ type: "HYDRATE", answers: restored });
      // HYDRATE と同じ effect の中で立てるので、結果画面は最初から answeredHere=false で描かれる（送らない）
      setFromShare(true);
    }
    // 2026年10月28日：読み込んだあとは URL から ?sim= を消す（回答の中身が GA4 や履歴に残らないように）。
    // GA4 の最初の page_view からは GoogleAnalytics.tsx の側で外している。
    window.history.replaceState(window.history.state, "", "/simulator");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleRestart() {
    dispatch({ type: "RESET" });
    setFromShare(false);
    router.replace("/simulator");
  }

  const isResult = machine.step > TOTAL_QUESTIONS;
  const currentQuestion = questions[machine.step - 1];

  return (
    <div className="min-h-screen bg-green-50/40">
      {/* ページ見出し（旧版agri-simulator-v4.html .hdr、103〜108行目の移植）
          出典：agri-simulator-v4.html 旧版は/simulatorのメタデータだけでなく、
          ページ上部に常時表示される見出しブロックを持っていた。 */}
      <div className="mx-auto max-w-content px-5 pb-2 pt-10 text-center sm:px-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-green-600">
          Agri-Guide｜就農シミュレーター
        </p>
        <h1 className="mt-2 font-serif text-xl font-black leading-snug text-ink sm:text-2xl">
          あなたの<span className="text-green-700">就農プラン</span>を具体的に描く
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
          10の質問に答えるだけ。補助金・初期費用・おすすめ地域・相談窓口が出ます。
        </p>
        {isNotifyEnabled && (
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted">
            答えた内容（年代・品目・自己資金など。氏名や連絡先は含みません）は運営者に届き、サイトをよくするために使います（
            <Link href="/privacy" className="underline">プライバシーポリシー</Link>）。
          </p>
        )}
      </div>
      {!isResult && <ProgressBar current={machine.step} total={TOTAL_QUESTIONS} />}
      <div className="px-5 py-10 sm:px-10 sm:py-14">
        {isResult ? (
          <ResultScreen answers={machine.answers} onRestart={handleRestart} answeredHere={!fromShare} />
        ) : (
          currentQuestion && (
            <div className="mx-auto max-w-content">
              <QuestionStep
                question={currentQuestion}
                machine={machine}
                dispatch={dispatch}
                onNext={() => dispatch({ type: "NEXT" })}
                onBack={() => dispatch({ type: "BACK" })}
                isFirst={machine.step === 1}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}
