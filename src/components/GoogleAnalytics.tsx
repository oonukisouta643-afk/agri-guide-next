import Script from "next/script";

// F-07：Google Analytics 4設定
// 出典：AgriGuide_Next移行_要件定義書v2.0 §0「移行理由（5）Google Analytics未導入」
//
// 測定ID（G-XXXXXXXXXX）はGA4プロパティを作成しないと発行されないため、要件定義書にも
// 記載がない。実在しないIDを仮に埋め込むと誤ったデータが送信されかねないため、
// 環境変数 NEXT_PUBLIC_GA_MEASUREMENT_ID が設定されている場合のみ読み込む方式にした。
// 導入手順：
//   1. https://analytics.google.com でGA4プロパティを作成し、測定ID（G-から始まる文字列）を取得
//   2. Vercelのプロジェクト設定 → Environment Variables に
//      NEXT_PUBLIC_GA_MEASUREMENT_ID = 取得した測定ID を追加して再デプロイ

export function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!measurementId) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
