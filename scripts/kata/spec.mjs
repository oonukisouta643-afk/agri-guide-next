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

/**
 * 豪雪地帯の指定（20市町村。載っていない市町村は「指定なし」）。
 * 出典：福島県「福島県豪雪地帯対策基本計画（第四次）」令和6年3月 資料編（令和5年4月1日現在）
 * https://www.pref.fukushima.lg.jp/uploaded/attachment/623392.pdf
 * scope：指定が市町村の一部のときの範囲（同じ資料の注と表から）
 */
const SPECIAL = "特別豪雪地帯", PART_SPECIAL = "豪雪地帯（一部が特別豪雪地帯）", SNOWY = "豪雪地帯", PART_SNOWY = "一部が豪雪地帯";
export const SNOW_AREAS = {
  福島市: { area: PART_SNOWY, scope: "昭和39年1月1日合併前の旧福島市・旧飯坂町、昭和43年10月1日合併前の旧吾妻町の地域" },
  会津若松市: { area: SNOWY },
  郡山市: { area: PART_SNOWY, scope: "昭和40年5月1日合併前の旧湖南村の地域" },
  喜多方市: { area: PART_SPECIAL, scope: "特別豪雪地帯は旧熱塩加納村・旧山都町・旧高郷村" },
  天栄村: { area: SNOWY },
  下郷町: { area: SPECIAL }, 檜枝岐村: { area: SPECIAL }, 只見町: { area: SPECIAL },
  南会津町: { area: PART_SPECIAL, scope: "特別豪雪地帯は旧舘岩村・旧伊南村・旧南郷村" },
  北塩原村: { area: SPECIAL }, 西会津町: { area: SPECIAL }, 磐梯町: { area: SPECIAL }, 猪苗代町: { area: SPECIAL },
  会津坂下町: { area: SNOWY }, 湯川村: { area: SNOWY },
  柳津町: { area: SPECIAL }, 三島町: { area: SPECIAL }, 金山町: { area: SPECIAL }, 昭和村: { area: SPECIAL },
  会津美里町: { area: PART_SPECIAL, scope: "特別豪雪地帯は旧会津高田町" },
};

/**
 * 県の「避難地域12市町村」（福島県「ふくしま復興情報ポータルサイト」の一覧、2026年11月3日確認）。
 * https://www.pref.fukushima.lg.jp/site/portal/cat01-more.html
 * 避難指示は区域ごとで、市町村の全域だったところと一部の地区だけだったところがある。毎年の更新では触らない
 */
export const EVAC_AREA_12 = ["田村市", "南相馬市", "川俣町", "広野町", "楢葉町", "富岡町", "川内村", "大熊町", "双葉町", "浪江町", "葛尾村", "飯舘村"];

/** 道のりのページを作る品目（ぶどうは前提を確かめてから） */
export const CROPS = [
  { id: "momo", name: "もも", csvName: "もも", laborVariety: "もも あかつき" },
  { id: "nashi", name: "なし", csvName: "なし", laborVariety: "なし 幸水" },
  { id: "ringo", name: "りんご", csvName: "りんご", laborVariety: "りんご ふじ" },
];
