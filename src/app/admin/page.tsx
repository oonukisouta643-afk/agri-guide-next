import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AdminTabs } from "@/components/admin/AdminTabs";

// / admin　行政向け提案書素材
// 出典：AgriGuide_Next移行_要件定義書v2.0 §2「/ admin」
// 内部・行政向けの資料のため、検索エンジンにはインデックスさせない（noindex）。

export const metadata: Metadata = {
  title: "行政向け提案書素材",
  description: "県北ふくしまAgri-Guideの行政向け提案資料。",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="px-5 py-14 sm:px-10 sm:py-[72px]">
      <SectionHeader
        eye="admin"
        title="行政向け提案書素材"
        lead="福島県北地域の行政・農業関係者の方へ向けた、Agri-Guideの提案資料です。"
      />
      <div className="mx-auto mt-10 max-w-5xl">
        <AdminTabs />
      </div>
    </div>
  );
}
