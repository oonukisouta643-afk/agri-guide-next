"use client";

import { useEffect, useRef, useState } from "react";

// スクロールrevealアニメーション（F-06）
// 出典：AgriGuide_Next移行_要件定義書v2.0 §3（アニメーション）
// IntersectionObserverで要素が画面に入ったらopacity 0→1・translateY(20px)→0、duration 0.5s ease

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** 複数要素を連続表示する場合の遅延（ms） */
  delayMs?: number;
};

export function Reveal({ children, className = "", delayMs = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // prefers-reduced-motionの場合はアニメーションなしで即表示
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      } ${className}`}
      style={{ transitionDelay: isVisible ? `${delayMs}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
