import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TaskProgress } from "@/components/dashboard/TaskProgress";
import { PlaceholderList } from "@/components/dashboard/PlaceholderList";
import { FutureTaskList } from "@/components/dashboard/FutureTaskList";

// / dashboard　プロジェクトダッシュボード（内部管理用）
// 出典：AgriGuide_Next移行_要件定義書v2.0 §2「/ dashboard」
// 「アクセス制限：なし（URL直接共有）」の仕様通りだが、検索エンジンには
// インデックスさせない（noindex）。個人情報（メールアドレス・電話番号）は掲載しない。

export const metadata: Metadata = {
  title: "プロジェクトダッシュボード",
  description: "県北ふくしまAgri-Guide 内部管理用ダッシュボード。",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return (
    <div className="px-5 py-14 sm:px-10 sm:py-[72px]">
      <SectionHeader
        eye="dashboard v6"
        title="プロジェクトダッシュボード"
        lead="内部管理用ページです。タスク進捗・仮データ差し替えリスト・将来のタスクを一覧できます。"
      />

      <div className="mx-auto mt-10 max-w-5xl space-y-14">
        <section>
          <h2 className="text-ink">タスク管理</h2>
          <div className="mt-4">
            <TaskProgress />
          </div>
        </section>

        <section>
          <h2 className="text-ink">仮データ差し替えリスト</h2>
          <p className="mt-2 text-sm text-muted">
            Next.js移行（Phase 2〜5）で作成した仮データ・仮コンテンツの一覧です。農家ヒアリング・行政からの情報提供が済み次第、差し替えが必要です。
          </p>
          <div className="mt-4">
            <PlaceholderList />
          </div>
        </section>

        <section>
          <h2 className="text-ink">将来のタスク（機能拡張計画）</h2>
          <div className="mt-4">
            <FutureTaskList />
          </div>
        </section>
      </div>
    </div>
  );
}
