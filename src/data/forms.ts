// アンケートURL（ハードコード）
// 出典：AgriGuide_Next移行_要件定義書v2.0 §9

export type SurveyForm = {
  id: string;
  color: "green" | "sky" | "purple" | "gold" | "red";
  target: string;
  questionCount: number;
  duration: string;
  url: string;
};

export const surveyForms: SurveyForm[] = [
  {
    id: "FORM 01",
    color: "green",
    target: "農家・就農経験者",
    questionCount: 12,
    duration: "5〜8分",
    url: "https://docs.google.com/forms/d/1jSS7IOpndtpdCHYz9fATKBJyfVguJVyZBSV46zIX_Ts/viewform",
  },
  {
    id: "FORM 02",
    color: "sky",
    target: "就農を断念した方",
    questionCount: 11,
    duration: "3〜5分",
    url: "https://docs.google.com/forms/d/1sZedXgyyuVyHag3ZYN45xwjaBe5xw4XD7oZaSBGZeQU/viewform",
  },
  {
    id: "FORM 03",
    color: "purple",
    target: "農業関係者（JA・行政）",
    questionCount: 9,
    duration: "5〜8分",
    url: "https://docs.google.com/forms/d/1WdVTBdPLLlYW3hcaIm1UJ9yBR0Tf95Mnj2hqwgehB98/viewform",
  },
  {
    id: "FORM 04",
    color: "gold",
    target: "就農検討中の方",
    questionCount: 12,
    duration: "3〜5分",
    url: "https://docs.google.com/forms/d/11Nf3tqSnBHhFHke82s630ojAKi9aanW3uAxmWb9bDZA/viewform",
  },
  {
    id: "FORM 05",
    color: "red",
    target: "就農地域を探している方",
    questionCount: 10,
    duration: "3〜5分",
    url: "https://docs.google.com/forms/d/1JIZSyWLVMPvf3duzFax1zUKC69LSn6z_vhNaMdkueLY/viewform",
  },
];
