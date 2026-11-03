// 市町村ページの「窓口」に足す案内。県の就農の窓口（ふくのう）は全市町村に、
// 県の「避難地域12市町村」には事実の注記と、いまの区域・移住の相談先への案内を出す。
// 言い方は、県・ふくのうへの意見照会で確かめる（README「外に出す前に確かめること」）。
import type { Source } from "../types";
import { SourceRef } from "./SourcedValue";

const FUKUNOU_URL = "https://start-fukuagri.jp/syuno/";
const EVAC_STATUS_URL = "https://www.pref.fukushima.lg.jp/sec/11050a/"; // 福島県 避難地域復興課
// ふくしま12市町村移住支援センター（未来ワークふくしま）。下位のページ（農業は /agri12/）は変わりやすいので、トップにつなぐ
const MIGRATION_12_URL = "https://mirai-work.life/";

const linkClass = "underline decoration-gray-300 underline-offset-2";

export function ContactGuides({ name, evacuationSourceId, getSource, sourcesHref }: {
  name: string;
  /** 県の「避難地域12市町村」に入るときだけ渡す */
  evacuationSourceId?: string;
  getSource: (id: string) => Source | undefined;
  sourcesHref: string;
}) {
  return (
    <div className="mt-2 space-y-2 text-sm">
      <p>
        就農の相談窓口：<a href={FUKUNOU_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>福島県の就農ポータル「ふくのう」</a>
      </p>
      {evacuationSourceId && (
        <p className="text-xs text-gray-600">
          {name}は、県が「避難地域12市町村」と呼ぶ市町村の一つです。東京電力福島第一原子力発電所の事故のあと、市町村の全域または一部の地区に避難指示などが出ました。解除の時期は地区によって違います。いまも避難指示が出ている区域があるかどうか、あればその範囲は、
          <a href={EVAC_STATUS_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>福島県 避難地域復興課のページ</a>
          で確かめられます。この12市町村には、移住の相談窓口として
          <a href={MIGRATION_12_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>ふくしま12市町村移住支援センター（未来ワークふくしま）</a>
          もあります。
          <SourceRef sourceId={evacuationSourceId} getSource={getSource} sourcesHref={sourcesHref} />
        </p>
      )}
    </div>
  );
}
