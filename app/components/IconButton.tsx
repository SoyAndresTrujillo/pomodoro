"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type Size = "sm" | "md" | "lg";

const dims: Record<Size, string> = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-14 w-14",
};

export default function IconButton({
  children,
  size = "md",
  variant = "filled",
  ...rest
}: {
  children: ReactNode;
  size?: Size;
  variant?: "filled" | "outline";
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const baseFilled = {
    background: "var(--btn)",
    boxShadow:
      "0 6px 18px -8px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
  };
  const hoverFilled = {
    background: "var(--btn-hover)",
    boxShadow:
      "0 10px 26px -8px rgba(242,69,53,0.55), inset 0 1px 0 rgba(255,255,255,0.12)",
  };
  const baseOutline = {
    background: "transparent",
    boxShadow:
      "inset 0 0 0 1px rgba(255,255,255,0.18)",
  };
  const hoverOutline = {
    background: "rgba(242,69,53,0.12)",
    boxShadow:
      "inset 0 0 0 1px rgba(242,69,53,0.7), 0 8px 22px -10px rgba(242,69,53,0.45)",
  };
  const base = variant === "filled" ? baseFilled : baseOutline;
  const hover = variant === "filled" ? hoverFilled : hoverOutline;

  return (
    <button
      {...rest}
      className={`flex ${dims[size]} items-center justify-center rounded-full text-[color:var(--text)] transition-all duration-300 ${rest.className ?? ""}`}
      style={base}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, hover);
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, base);
      }}
    >
      {children}
    </button>
  );
}
