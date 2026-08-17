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
      const crops = state.answers.crops.includes(action.value as never)
        ? state.answers.crops.filter((c) => c !== action.value)
        : [...state.answers.crops, action.value as SimulatorState["crops"][number]];
      return { ...state, answers: { ...state.answers, crops } };
    }
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
