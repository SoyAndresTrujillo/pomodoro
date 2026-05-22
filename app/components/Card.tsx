"use client";

import { ReactNode } from "react";

export default function Card({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative aspect-square w-[min(92vw,560px)] rounded-[2.25rem] overflow-hidden"
      style={{
        background:
          "linear-gradient(140deg, #181818 0%, #0f0f0f 55%, #0a0a0a 100%)",
        boxShadow:
          "0 30px 80px -20px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.04), inset 0 0 0 1px rgba(255,255,255,0.03)",
        animation: "card-in 700ms cubic-bezier(0.22, 1, 0.36, 1) both",
      }}
    >
      {/* Red ambient glow top-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-20 h-[420px] w-[420px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(242,69,53,0.45) 0%, rgba(242,69,53,0.15) 35%, transparent 70%)",
          animation: "glow-pulse 6s ease-in-out infinite",
        }}
      />
      {children}
    </div>
  );
}
