// Tool A：農業カレンダー（品目から住む場所を考える）
// 出典：旧サイト（netlify-0816/agri-tools.html）CROPS_DATA（430〜509行）を移植。
// あんぽ柿（kaki）は旧サイトの7品目目として復元（476〜486行）。
// fit（県北との相性）・cost（初期費用目安）・bep（黒字化の目安）・life（生活環境）・
// areaNote・add/addName/addReason（複数品目提案）は全て旧サイトの実データを移植したもの。
// 「※仮データ」の注記は旧サイトのまま維持（2026年8月の農家ヒアリング後に実数値へ更新予定）。

export type CalendarCropKey = "momo" | "apple" | "nashi" | "saku" | "kaki" | "kyu" | "rice";

export type CalMonthType = "harvest" | "busy" | "work" | "";

export type CalMonth = {
  month: number;
  type: CalMonthType;
  label: string;
};

export type CalendarCrop = {
  key: CalendarCropKey;
  label: string;
  emoji: string;
  /** ◎/○/△ 県北との相性（旧サイトfitフィールド） */
  fit: string;
  fitLevel: "high" | "mid" | "low";
  productionAreas: string[];
  areaNote: string;
  /** 初期費用目安（旧サイトcostフィールド） */
  cost: string;
  /** 黒字化の目安（旧サイトbepフィールド） */
  bep: string;
  /** 生活環境（旧サイトlifeフィールド） */
  life: string;
  /** 1〜12月の作業・収穫カレンダー（旧サイトcalフィールド） */
  cal: CalMonth[];
  /** 収入安定化のための追加品目（旧サイトadd/addName/addReasonフィールド） */
  add: CalendarCropKey[];
  addName: string;
  addReason: string;
};

export const calendarCrops: CalendarCrop[] = [
  {
    key: "momo",
    label: "桃",
    emoji: "🍑",
    fit: "◎ 県北との相性が高い",
    fitLevel: "high",
    productionAreas: ["伊達市", "桑折町", "国見町"],
    areaNote: "県北地域は全国有数の桃の産地。寒暖差と日照が糖度を高める。",
    cost: "中程度（80〜120万円/反目安）",
    bep: "3〜5年",
    life: "新幹線・高速アクセス良好。スーパー・病院が揃う。東京から約80分。",
    cal: [
      { month: 1, type: "", label: "農閑期" },
      { month: 2, type: "work", label: "剪定" },
      { month: 3, type: "work", label: "開花・授粉" },
      { month: 4, type: "busy", label: "摘果" },
      { month: 5, type: "busy", label: "防除" },
      { month: 6, type: "work", label: "袋掛け" },
      { month: 7, type: "harvest", label: "収穫" },
      { month: 8, type: "harvest", label: "収穫ピーク" },
      { month: 9, type: "work", label: "後管理" },
      { month: 10, type: "work", label: "施肥" },
      { month: 11, type: "", label: "休眠" },
      { month: 12, type: "", label: "農閑期" },
    ],
    add: ["apple", "kaki"],
    addName: "りんご・あんぽ柿",
    addReason:
      "桃の収穫（7〜8月）が終わった後、りんご（9〜11月）・あんぽ柿（11〜2月）を加えると秋冬も収入が続きます。",
  },
  {
    key: "apple",
    label: "りんご",
    emoji: "🍎",
    fit: "◎ 県北との相性が高い",
    fitLevel: "high",
    productionAreas: ["二本松市", "国見町", "伊達市"],
    areaNote: "寒暖差がりんごの着色と糖度を高める。サンふじが主要品種。秋〜冬の収入になる。",
    cost: "中程度（60〜100万円/反目安）",
    bep: "5〜8年",
    life: "山間部エリアは自然環境豊か。福島市・伊達市中心部まで車30〜40分圏内。",
    cal: [
      { month: 1, type: "", label: "農閑期" },
      { month: 2, type: "work", label: "剪定" },
      { month: 3, type: "work", label: "開花準備" },
      { month: 4, type: "busy", label: "授粉" },
      { month: 5, type: "busy", label: "摘果" },
      { month: 6, type: "work", label: "防除" },
      { month: 7, type: "work", label: "夏剪定" },
      { month: 8, type: "work", label: "着色管理" },
      { month: 9, type: "harvest", label: "早生収穫" },
      { month: 10, type: "harvest", label: "収穫ピーク" },
      { month: 11, type: "harvest", label: "晩生収穫" },
      { month: 12, type: "", label: "農閑期" },
    ],
    add: ["momo", "nashi"],
    addName: "桃・梨",
    addReason:
      "りんごの収穫は10〜11月。桃（7〜8月）・梨（8〜9月）を加えると夏から冬まで途切れない収入サイクルが作れます。",
  },
  {
    key: "nashi",
    label: "梨",
    emoji: "🍐",
    fit: "○ 県北で栽培可能",
    fitLevel: "mid",
    productionAreas: ["伊達市", "国見町"],
    areaNote: "桃・りんごに比べ生産者が少なく差別化しやすい。8〜9月収穫で桃の後に続く品目。",
    cost: "中程度（70〜110万円/反目安）",
    bep: "4〜6年",
    life: "桃・りんごと同じエリアで栽培可能。農地も同一エリアで確保しやすい。",
    cal: [
      { month: 1, type: "", label: "農閑期" },
      { month: 2, type: "work", label: "剪定" },
      { month: 3, type: "work", label: "開花準備" },
      { month: 4, type: "busy", label: "授粉・摘果" },
      { month: 5, type: "busy", label: "摘果" },
      { month: 6, type: "work", label: "防除" },
      { month: 7, type: "work", label: "袋掛け" },
      { month: 8, type: "harvest", label: "収穫開始" },
      { month: 9, type: "harvest", label: "収穫ピーク" },
      { month: 10, type: "work", label: "施肥" },
      { month: 11, type: "", label: "休眠" },
      { month: 12, type: "", label: "農閑期" },
    ],
    add: ["momo", "apple"],
    addName: "桃・りんご",
    addReason:
      "梨の収穫（8〜9月）は桃とりんごの間。3品目を組み合わせると7〜11月の5ヶ月間、途切れなく収入が入ります。",
  },
  {
    key: "saku",
    label: "さくらんぼ",
    emoji: "🍒",
    fit: "△ 技術習得に時間がかかる",
    fitLevel: "low",
    productionAreas: ["桑折町", "国見町"],
    areaNote: "6月収穫で最も早い果樹。単価が高くブランド力があるが、技術難易度も高め。",
    cost: "高め（100〜180万円/反目安）",
    bep: "6〜10年",
    life: "さくらんぼの産地は県北の比較的標高がある地域。山形との気候の違いに注意。",
    cal: [
      { month: 1, type: "", label: "農閑期" },
      { month: 2, type: "work", label: "剪定" },
      { month: 3, type: "work", label: "開花準備" },
      { month: 4, type: "busy", label: "開花・防霜" },
      { month: 5, type: "busy", label: "着果管理" },
      { month: 6, type: "harvest", label: "収穫ピーク" },
      { month: 7, type: "work", label: "収穫後管理" },
      { month: 8, type: "work", label: "施肥" },
      { month: 9, type: "", label: "農閑期" },
      { month: 10, type: "", label: "農閑期" },
      { month: 11, type: "", label: "落葉" },
      { month: 12, type: "", label: "農閑期" },
    ],
    add: ["momo", "apple"],
    addName: "桃・りんご",
    addReason:
      "さくらんぼは6月収穫。桃（7〜8月）・りんご（10〜11月）を加えると6〜11月の半年間収入が続きます。ただし最初の1品目には難易度が高め。",
  },
  {
    key: "kaki",
    label: "あんぽ柿",
    emoji: "🟠",
    fit: "○ 県北の伝統品目",
    fitLevel: "mid",
    productionAreas: ["福島県北地域（中通り北部）"],
    areaNote:
      "11月〜2月出荷の伝統加工品。冬の収入源になる希少な品目。半乾燥の独特製法で高付加価値。",
    cost: "低〜中（40〜80万円/反目安）",
    bep: "5〜8年",
    life: "加工施設の設備投資が必要。JAとの連携が重要な品目。",
    cal: [
      { month: 1, type: "harvest", label: "出荷" },
      { month: 2, type: "harvest", label: "出荷終盤" },
      { month: 3, type: "", label: "農閑期" },
      { month: 4, type: "", label: "農閑期" },
      { month: 5, type: "", label: "農閑期" },
      { month: 6, type: "", label: "農閑期" },
      { month: 7, type: "", label: "農閑期" },
      { month: 8, type: "work", label: "管理" },
      { month: 9, type: "work", label: "施肥" },
      { month: 10, type: "busy", label: "収穫・加工準備" },
      { month: 11, type: "harvest", label: "加工・出荷開始" },
      { month: 12, type: "harvest", label: "出荷" },
    ],
    add: ["momo", "apple"],
    addName: "桃・りんご",
    addReason:
      "あんぽ柿は冬（11〜2月）が出荷期。桃・りんごと組み合わせると年間を通じた収入サイクルが完成します。",
  },
  {
    key: "kyu",
    label: "きゅうり",
    emoji: "🥒",
    fit: "◎ 初期費用を抑えやすい",
    fitLevel: "high",
    productionAreas: ["二本松市", "大玉村", "伊達地域全体"],
    areaNote:
      "野菜の中では比較的早く収入になる品目。県北は全国有数のきゅうり産地で、JAの出荷体制が整っている。",
    cost: "低〜中（50〜120万円/反目安）",
    bep: "1〜2年",
    life: "相馬方面は海側で気候が穏やか。福島市中心部より海に近い生活環境。",
    cal: [
      { month: 1, type: "", label: "農閑期" },
      { month: 2, type: "work", label: "育苗準備" },
      { month: 3, type: "busy", label: "定植（春作）" },
      { month: 4, type: "harvest", label: "収穫開始" },
      { month: 5, type: "harvest", label: "収穫ピーク" },
      { month: 6, type: "harvest", label: "収穫" },
      { month: 7, type: "harvest", label: "次作準備" },
      { month: 8, type: "busy", label: "定植（秋作）" },
      { month: 9, type: "harvest", label: "収穫" },
      { month: 10, type: "harvest", label: "収穫ピーク" },
      { month: 11, type: "work", label: "後片付け" },
      { month: 12, type: "", label: "農閑期" },
    ],
    add: ["momo", "rice"],
    addName: "桃・米",
    addReason:
      "きゅうりは春〜秋2回収穫できる品目。桃（7〜8月）・米（9〜10月）と組み合わせると年間通じた収入になります。",
  },
  {
    key: "rice",
    label: "米",
    emoji: "🌾",
    fit: "○ 機械化で負担が少ない",
    fitLevel: "mid",
    productionAreas: ["大玉村", "本宮市", "県北全域"],
    areaNote:
      "機械化が進んでおり体力的な負担が比較的少ない。県北産米は全国的に評価が高い。冬は農閑期になるため副業や他品目との組み合わせがしやすい。",
    cost: "低（30〜80万円/反目安）",
    bep: "2〜4年",
    life: "県北全域で栽培可能。機械（田植え機・コンバイン）の初期投資が必要だが、リースや農業法人経由での就農も選択肢。",
    cal: [
      { month: 1, type: "", label: "農閑期" },
      { month: 2, type: "", label: "計画・準備" },
      { month: 3, type: "work", label: "育苗準備" },
      { month: 4, type: "busy", label: "育苗・代かき" },
      { month: 5, type: "busy", label: "田植え" },
      { month: 6, type: "work", label: "除草・施肥" },
      { month: 7, type: "work", label: "水管理" },
      { month: 8, type: "work", label: "出穂・水管理" },
      { month: 9, type: "harvest", label: "収穫・脱穀" },
      { month: 10, type: "harvest", label: "乾燥調製" },
      { month: 11, type: "work", label: "稲わら処理" },
      { month: 12, type: "", label: "農閑期" },
    ],
    add: ["momo", "kyu"],
    addName: "桃・きゅうり",
    addReason:
      "米の収穫は9〜10月。桃（7〜8月）・きゅうり（春・秋）と組み合わせると春から秋まで切れ目なく農業に携われます。冬は農閑期として活用できます。",
  },
];

export function getCalendarCrop(key: CalendarCropKey): CalendarCrop {
  return calendarCrops.find((c) => c.key === key) ?? calendarCrops[0];
}
