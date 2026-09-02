"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { navLinks, simulatorCta } from "@/data/site";
import { Button } from "@/components/ui/Button";

// 共通Header
// 出典：AgriGuide_Next移行_要件定義書v2.0 §4
// - モバイル：ロゴ＋ハンバーガーのみ。タップでドロワー展開
// - タブレット以上：横並びナビ＋右端CTA
// - スクロール時：背景white・shadow追加（backdrop-blur）

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-white/90 backdrop-blur shadow"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="font-serif text-lg font-bold text-green-700"
        >
          🌿 Agri-Guide
        </Link>

        {/* タブレット以上：横並びナビ */}
        <nav
          aria-label="メインナビゲーション"
          className="hidden items-center gap-6 sm:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink hover:text-green-700"
            >
              {link.label}
            </Link>
          ))}
          <Button href={simulatorCta.href} size="sm">
            {simulatorCta.label}
          </Button>
        </nav>

        {/* モバイル：ハンバーガー */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded sm:hidden"
          aria-label={isDrawerOpen ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={isDrawerOpen}
          aria-controls="mobile-drawer"
          onClick={() => setIsDrawerOpen((open) => !open)}
        >
          <span className="sr-only">メニュー</span>
          <div className="flex flex-col gap-1.5">
            <span
              className={`block h-0.5 w-6 bg-green-700 transition-transform ${
                isDrawerOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-green-700 transition-opacity ${
                isDrawerOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-green-700 transition-transform ${
                isDrawerOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* モバイルドロワー */}
      {isDrawerOpen && (
        <nav
          id="mobile-drawer"
          aria-label="モバイルメニュー"
          className="flex flex-col gap-1 border-t border-green-200 bg-white px-5 py-4 sm:hidden"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded px-2 py-3 text-sm font-medium text-ink hover:bg-green-50"
              onClick={() => setIsDrawerOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Button href={simulatorCta.href} className="mt-2 w-full">
            {simulatorCta.label}
          </Button>
        </nav>
      )}
    </header>
  );
}
