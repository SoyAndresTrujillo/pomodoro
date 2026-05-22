"use client";

import { ChevronLeft, Minus, Plus } from "lucide-react";
import IconButton from "./IconButton";
import { t } from "@/lib/i18n";
import { SettingsKey, SETTINGS_BOUNDS } from "@/lib/settings";

const TITLES: Record<SettingsKey, string> = {
  focusMin: t.settings.row.focusSession,
  shortBreakMin: t.settings.row.shortBreak,
  longBreakMin: t.settings.row.longBreak,
  longBreakAfter: t.settings.row.longBreakAfter,
};

const UNITS: Record<SettingsKey, string> = {
  focusMin: t.settings.unit.min,
  shortBreakMin: t.settings.unit.min,
  longBreakMin: t.settings.unit.min,
  longBreakAfter: t.settings.unit.sessions,
};

export default function EditTime({
  settingKey,
  value,
  onBack,
  onChange,
}: {
  settingKey: SettingsKey;
  value: number;
  onBack: () => void;
  onChange: (next: number) => void;
}) {
  const bounds = SETTINGS_BOUNDS[settingKey];
  const dec = () => onChange(value - bounds.step);
  const inc = () => onChange(value + bounds.step);
  const atMin = value <= bounds.min;
  const atMax = value >= bounds.max;

  return (
    <div className="absolute inset-0 flex flex-col px-7 pt-7 pb-7">
      <header>
        <IconButton
          aria-label={t.edit.aria.back}
          variant="outline"
          onClick={onBack}
        >
          <ChevronLeft size={20} strokeWidth={1.6} />
        </IconButton>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <h2
          className="text-[28px] font-medium tracking-tight text-[color:var(--text)]"
          style={{ letterSpacing: "-0.015em" }}
        >
          {TITLES[settingKey]}
        </h2>

        <div className="flex items-center gap-7">
          <IconButton
            aria-label={t.edit.aria.decrement}
            variant="outline"
            size="lg"
            onClick={dec}
            disabled={atMin}
            style={{ opacity: atMin ? 0.35 : 1 }}
          >
            <Minus size={22} strokeWidth={1.6} />
          </IconButton>

          <div
            className="tabular font-mono text-white"
            style={{
              fontSize: "clamp(72px, 14vw, 120px)",
              fontWeight: 500,
              letterSpacing: "-0.05em",
              lineHeight: 1,
              minWidth: "2ch",
              textAlign: "center",
              textShadow: "0 0 30px rgba(255,255,255,0.06)",
            }}
          >
            {value}
          </div>

          <IconButton
            aria-label={t.edit.aria.increment}
            variant="outline"
            size="lg"
            onClick={inc}
            disabled={atMax}
            style={{ opacity: atMax ? 0.35 : 1 }}
          >
            <Plus size={22} strokeWidth={1.6} />
          </IconButton>
        </div>

        <span className="text-[14px] text-[color:var(--muted)]">
          {UNITS[settingKey]}
        </span>
      </div>
    </div>
  );
}
