import { Hero } from "@/components/sections/Hero";
import { Story } from "@/components/sections/Story";
import { How } from "@/components/sections/How";
import { Field } from "@/components/sections/Field";
import { Tools } from "@/components/sections/Tools";
import { Regions } from "@/components/sections/Regions";
import { Contact } from "@/components/sections/Contact";

// トップページ（/）
// 出典：AgriGuide_Next移行_要件定義書v2.0 §5
// セクション順序：Hero→Story→How→Field→Tools→Regions→Contact
// 2026年8月20日：チーム紹介セクションは削除（運営者個人・協力者の情報を最小化する方針のため）

export default function Home() {
  return (
    <>
      <Hero />
      <Story />
      <How />
      <Field />
      <Tools />
      <Regions />
      <Contact />
    </>
  );
}
