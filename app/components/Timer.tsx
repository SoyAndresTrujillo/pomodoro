"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Eye, Settings, Undo2 } from "lucide-react";
import { t } from "@/lib/i18n";

const FOCUS_SECONDS = 1 * 60;
const TOTAL_PIPS = 4;
const ACTIVE_PIP = 0;

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

export default function Timer() {
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_SECONDS);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const progress = (FOCUS_SECONDS - secondsLeft) / FOCUS_SECONDS;
  const dashOffset = useMemo(
    () => RING_CIRC * (1 - progress),
    [progress]
  );

  const isPristine = secondsLeft === FOCUS_SECONDS && !running;
  const buttonLabel = running
    ? t.timer.button.pause
    : isPristine
    ? t.timer.button.start
    : t.timer.button.resume;

  const onPrimary = () => setRunning((r) => !r);
  const onReset = () => {
    setRunning(false);
    setSecondsLeft(FOCUS_SECONDS);
  };

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
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          className="relative flex items-center justify-center"
          style={{ width: RING_SIZE, height: RING_SIZE }}
        >
          {/* Progress ring */}
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
            {/* Track */}
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              fill="none"
              stroke="var(--track)"
              strokeWidth={RING_STROKE}
            />
            {/* Progress */}
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

          {/* Centered stack: icon, time, pips, label */}
          <div className="relative flex flex-col items-center gap-4">
            <Eye
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
              {Array.from({ length: TOTAL_PIPS }).map((_, i) => (
                <span
                  key={i}
                  className="block h-[3px] w-3 rounded-full transition-colors"
                  style={{
                    background:
                      i === ACTIVE_PIP ? "var(--accent)" : "#3a3a3a",
                  }}
                />
              ))}
            </div>
            <span
              className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--muted)]"
              style={{ fontWeight: 500 }}
            >
              {t.timer.label.focus}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-7 left-0 right-0 flex items-center justify-between px-7">
        <IconButton aria-label={t.timer.aria.reset} onClick={onReset}>
          <Undo2 size={18} strokeWidth={1.6} />
        </IconButton>

        <button
          onClick={onPrimary}
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

        <IconButton aria-label={t.timer.aria.settings}>
          <Settings size={18} strokeWidth={1.6} />
        </IconButton>
      </div>
    </div>
  );
}

function IconButton({
  children,
  onClick,
  ...rest
}: {
  children: React.ReactNode;
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={onClick}
      {...rest}
      className="flex h-11 w-11 items-center justify-center rounded-full text-[color:var(--text)] transition-all duration-300"
      style={{
        background: "var(--btn)",
        boxShadow:
          "0 6px 18px -8px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--btn-hover)";
        e.currentTarget.style.boxShadow =
          "0 10px 26px -8px rgba(242,69,53,0.55), inset 0 1px 0 rgba(255,255,255,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--btn)";
        e.currentTarget.style.boxShadow =
          "0 6px 18px -8px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)";
      }}
    >
      {children}
    </button>
  );
}
