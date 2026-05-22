"use client";

import { useMemo } from "react";
import { Coffee, Eye, Settings, Undo2 } from "lucide-react";
import IconButton from "./IconButton";
import { t } from "@/lib/i18n";
import { Phase } from "@/lib/timer";

const RING_SIZE = 360;
const RING_STROKE = 3;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRC = 2 * Math.PI * RING_RADIUS;

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function labelFor(phase: Phase): string {
  switch (phase) {
    case "focus":
      return t.timer.label.focus;
    case "shortBreak":
      return t.timer.label.shortBreak;
    case "longBreak":
      return t.timer.label.longBreak;
  }
}

export default function Timer({
  phase,
  secondsLeft,
  total,
  running,
  isPristine,
  focusInRound,
  longBreakAfter,
  onToggle,
  onReset,
  onOpenSettings,
}: {
  phase: Phase;
  secondsLeft: number;
  total: number;
  running: boolean;
  isPristine: boolean;
  focusInRound: number;
  longBreakAfter: number;
  onToggle: () => void;
  onReset: () => void;
  onOpenSettings: () => void;
}) {
  const progress = (total - secondsLeft) / Math.max(total, 1);
  const dashOffset = useMemo(
    () => RING_CIRC * (1 - progress),
    [progress]
  );

  const buttonLabel = running
    ? t.timer.button.pause
    : isPristine
    ? t.timer.button.start
    : t.timer.button.resume;

  const totalPips = Math.max(1, longBreakAfter);
  const PhaseIcon = phase === "focus" ? Eye : Coffee;

  return (
    <>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          className="relative flex items-center justify-center"
          style={{ width: RING_SIZE, height: RING_SIZE }}
        >
          <svg
            className="absolute inset-0 -rotate-90"
            width={RING_SIZE}
            height={RING_SIZE}
            viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
          >
            <defs>
              <filter id="arcGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ff6a4d" />
                <stop offset="100%" stopColor="#f24535" />
              </linearGradient>
            </defs>
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              fill="none"
              stroke="var(--track)"
              strokeWidth={RING_STROKE}
            />
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              fill="none"
              stroke="url(#arcGrad)"
              strokeWidth={RING_STROKE + 0.5}
              strokeLinecap="round"
              strokeDasharray={RING_CIRC}
              strokeDashoffset={dashOffset}
              filter="url(#arcGlow)"
              style={{
                transition: "stroke-dashoffset 900ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </svg>

          <div className="relative flex flex-col items-center gap-4">
            <PhaseIcon
              size={22}
              strokeWidth={1.4}
              className="text-[color:var(--muted)]"
            />
            <div
              className="tabular font-mono text-white"
              style={{
                fontSize: "clamp(56px, 11vw, 96px)",
                fontWeight: 500,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                textShadow: "0 0 30px rgba(255,255,255,0.06)",
              }}
            >
              {formatTime(secondsLeft)}
            </div>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPips }).map((_, i) => (
                <span
                  key={i}
                  className="block h-[3px] w-3 rounded-full transition-colors"
                  style={{
                    background:
                      i < focusInRound ? "var(--accent)" : "#3a3a3a",
                  }}
                />
              ))}
            </div>
            <span
              className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--muted)]"
              style={{ fontWeight: 500 }}
            >
              {labelFor(phase)}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-7 left-0 right-0 flex items-center justify-between px-7">
        <IconButton aria-label={t.timer.aria.reset} onClick={onReset}>
          <Undo2 size={18} strokeWidth={1.6} />
        </IconButton>

        <button
          onClick={onToggle}
          className="group relative h-11 min-w-[140px] rounded-full px-7 text-[11px] uppercase tracking-[0.32em] text-[color:var(--text)] transition-all duration-300 ease-out"
          style={{
            background: "var(--btn)",
            boxShadow:
              "0 8px 24px -10px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--btn-hover)";
            e.currentTarget.style.boxShadow =
              "0 14px 34px -10px rgba(242,69,53,0.55), inset 0 1px 0 rgba(255,255,255,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--btn)";
            e.currentTarget.style.boxShadow =
              "0 8px 24px -10px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)";
          }}
        >
          <span className="relative font-medium">{buttonLabel}</span>
        </button>

        <IconButton aria-label={t.timer.aria.settings} onClick={onOpenSettings}>
          <Settings size={18} strokeWidth={1.6} />
        </IconButton>
      </div>
    </>
  );
}
