import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

// 共通UIコンポーネント：Button
// 出典：AgriGuide_Next移行_要件定義書v2.0 §4
// variant: primary(green-700背景・ホバーで-2px) / secondary / ghost

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "sm";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-green-700 text-white hover:bg-green-600 hover:-translate-y-0.5 hover:shadow",
  secondary:
    "bg-white text-green-700 border border-green-700 hover:bg-green-50",
  ghost: "bg-transparent text-ink hover:bg-green-50",
};

const sizeClasses: Record<Size, string> = {
  md: "px-5 py-3 text-base",
  sm: "px-3 py-2 text-sm",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded font-bold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

export type ButtonProps = ButtonAsLink | ButtonAsButton;

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  href,
  ...rest
}: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
