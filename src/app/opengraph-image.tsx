import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// サイト全体の既定OGP画像（F-08）
// 出典：デザイントークンはAgriGuide_Next移行_要件定義書v2.0 §3のカラーパレットに準拠。
// ページ個別のOGP画像指定がある場合は、各ルートに同名ファイルを配置すれば上書きされる
// （Next.jsのファイルベースルーティング規約）。現時点では全ページ共通の1枚のみ用意。
//
// フォントについて：next/og（Satori）は既定では日本語グリフを持たないため、
// 何も指定しないと日本語部分が文字化け（トーフ表示）する。Noto Sans CJK JPから
// このOG画像の表示文言に必要な文字だけをfonttoolsでサブセット抽出したwoffファイルを
// 同梱している（src/app/og-fonts/）。CDN取得（Google Fonts）に依存せず、ローカルの
// フォントファイルを読み込む方式にしたのは、サンドボックス環境でGoogle Fontsの
// CDNに到達できない問題が本プロジェクトで繰り返し発生していたため、本番・開発を
// 問わず安定して動作させる目的。runtimeもedgeではなくnodejsを指定し、fsで読み込む。
export const runtime = "nodejs";
export const alt = "県北ふくしまAgri-Guide｜農家という生き方を、もっとリアルに。";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const [notoSansJPBold, notoSansJPRegular] = await Promise.all([
    readFile(join(process.cwd(), "src/app/og-fonts/NotoSansJP-Bold.woff")),
    readFile(join(process.cwd(), "src/app/og-fonts/NotoSansJP-Regular.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #2D7A2D 0%, #1C3D1C 100%)",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 72 }}>🌿</span>
          <span style={{ fontSize: 56, fontFamily: "Noto Sans JP", fontWeight: 700, color: "#ffffff" }}>
            県北ふくしまAgri-Guide
          </span>
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 36,
            fontFamily: "Noto Sans JP",
            fontWeight: 400,
            color: "#F0FBF0",
            textAlign: "center",
          }}
        >
          農業という生き方を、もっとリアルに。
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Noto Sans JP", data: notoSansJPBold, weight: 700, style: "normal" },
        { name: "Noto Sans JP", data: notoSansJPRegular, weight: 400, style: "normal" },
      ],
    }
  );
}
