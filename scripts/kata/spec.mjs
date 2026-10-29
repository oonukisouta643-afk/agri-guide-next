// 要件定義書 v0.2 第3章の表（7地方・59市町村）。取り込みと検証の両方で、この表と完全に一致することを確かめる。
// 出典：福島県「市役所・町村役場一覧」（2026年1月22日更新）https://www.pref.fukushima.lg.jp/sec/01145a/yakuba.html
export const REGIONS = [
  { id: "kenpoku", name: "県北", municipalities: ["福島市", "二本松市", "伊達市", "本宮市", "桑折町", "国見町", "川俣町", "大玉村"] },
  { id: "kenchu", name: "県中", municipalities: ["郡山市", "須賀川市", "田村市", "鏡石町", "天栄村", "石川町", "玉川村", "平田村", "浅川町", "古殿町", "三春町", "小野町"] },
  { id: "kennan", name: "県南", municipalities: ["白河市", "西郷村", "泉崎村", "中島村", "矢吹町", "棚倉町", "矢祭町", "塙町", "鮫川村"] },
  { id: "aizu", name: "会津", municipalities: ["会津若松市", "喜多方市", "北塩原村", "西会津町", "磐梯町", "猪苗代町", "会津坂下町", "湯川村", "柳津町", "三島町", "金山町", "昭和村", "会津美里町"] },
  { id: "minamiaizu", name: "南会津", municipalities: ["下郷町", "檜枝岐村", "只見町", "南会津町"] },
  { id: "soso", name: "相双", municipalities: ["相馬市", "南相馬市", "広野町", "楢葉町", "富岡町", "川内村", "大熊町", "双葉町", "浪江町", "葛尾村", "新地町", "飯舘村"] },
  { id: "iwaki", name: "いわき", municipalities: ["いわき市"] },
];

/** 道のりのページを作る品目（ぶどうは前提を確かめてから） */
export const CROPS = [
  { id: "momo", name: "もも", csvName: "もも", laborVariety: "もも あかつき" },
  { id: "nashi", name: "なし", csvName: "なし", laborVariety: "なし 幸水" },
  { id: "ringo", name: "りんご", csvName: "りんご", laborVariety: "りんご ふじ" },
];
