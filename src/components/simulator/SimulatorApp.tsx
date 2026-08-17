"use client";

import { useEffect, useReducer } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProgressBar } from "@/components/simulator/ProgressBar";
import { QuestionStep } from "@/components/simulator/QuestionStep";
import { ResultScreen } from "@/components/simulator/ResultScreen";
import { simulatorReducer, initialMachineState } from "@/lib/simulator/reducer";
import { decodeParamToState } from "@/lib/simulator/calculations";
import { questions } from "@/lib/simulator/questions";
import { TOTAL_QUESTIONS } from "@/lib/simulator/types";

// 就農シミュレーターのメイン画面
// 出典：AgriGuide_Next移行_要件定義書v2.0 §6
// URLパラメータ（?sim=...）があれば回答を復元して結果を直接表示する（F-30・F-36）

export function SimulatorApp() {
  const [machine, dispatch] = useReducer(simulatorReducer, initialMachineState);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const param = searchParams.get("sim");
    if (!param) return;
    const restored = decodeParamToState(param);
    if (restored) {
      dispatch({ type: "HYDRATE", answers: restored });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleRestart() {
    dispatch({ type: "RESET" });
    router.replace("/simulator");
  }

  const isResult = machine.step > TOTAL_QUESTIONS;
  const currentQuestion = questions[machine.step - 1];

  return (
    <div className="min-h-screen bg-green-50/40">
      {!isResult && <ProgressBar current={machine.step} total={TOTAL_QUESTIONS} />}
      <div className="px-5 py-10 sm:px-10 sm:py-14">
        {isResult ? (
          <ResultScreen answers={machine.answers} onRestart={handleRestart} />
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
