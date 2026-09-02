import {
  initialSimulatorState,
  TOTAL_QUESTIONS,
  type SimulatorState,
} from "./types";

// F-20：useReducerでS（回答オブジェクト）を管理
// 出典：AgriGuide_Next移行_要件定義書v2.0 §6・§7

export type SimulatorStep = number; // 1〜10=質問, 11=結果

export type SimulatorMachineState = {
  step: SimulatorStep;
  answers: SimulatorState;
};

export const initialMachineState: SimulatorMachineState = {
  step: 1,
  answers: initialSimulatorState,
};

export type SimulatorAction =
  | { type: "SET_SINGLE"; key: keyof SimulatorState; value: string }
  | { type: "TOGGLE_CROP"; value: string }
  | { type: "SET_INCOME"; value: number }
  | { type: "SET_WORRY"; value: string }
  | { type: "SET_TIMING"; value: string }
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "RESET" }
  | { type: "HYDRATE"; answers: SimulatorState };

export function simulatorReducer(
  state: SimulatorMachineState,
  action: SimulatorAction
): SimulatorMachineState {
  switch (action.type) {
    case "SET_SINGLE":
      return {
        ...state,
        answers: { ...state.answers, [action.key]: action.value },
      };
    case "TOGGLE_CROP": {
      // 旧版handleChk()のロジックを移植：「まだわからない」（any）は他の品目選択と排他。
      // 何かを選ぶとanyは自動解除され、全て解除されるとanyが自動的に選択される。
      const value = action.value as SimulatorState["crops"][number];
      let crops: SimulatorState["crops"];
      if (value === "any") {
        crops = state.answers.crops.includes("any") ? [] : ["any"];
      } else {
        const withoutAny = state.answers.crops.filter((c) => c !== "any");
        crops = withoutAny.includes(value)
          ? withoutAny.filter((c) => c !== value)
          : [...withoutAny, value];
        if (crops.length === 0) crops = ["any"];
      }
      return { ...state, answers: { ...state.answers, crops } };
    }
    case "SET_INCOME":
      return { ...state, answers: { ...state.answers, income: action.value } };
    case "SET_WORRY":
      return {
        ...state,
        answers: { ...state.answers, worry: action.value as SimulatorState["worry"] },
      };
    case "SET_TIMING":
      return {
        ...state,
        answers: { ...state.answers, timing: action.value as SimulatorState["timing"] },
      };
    case "NEXT":
      return {
        ...state,
        step: Math.min(state.step + 1, TOTAL_QUESTIONS + 1),
      };
    case "BACK":
      return { ...state, step: Math.max(state.step - 1, 1) };
    case "RESET":
      return initialMachineState;
    case "HYDRATE":
      return { step: TOTAL_QUESTIONS + 1, answers: action.answers };
    default:
      return state;
  }
}
