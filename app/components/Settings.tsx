"use client";

import { ChevronRight, X } from "lucide-react";
import IconButton from "./IconButton";
import { t } from "@/lib/i18n";
import { Settings as SettingsType, SettingsKey } from "@/lib/settings";

type Row = {
  key: SettingsKey;
  label: string;
  unit: string;
};

const ROWS: Row[] = [
  { key: "focusMin", label: t.settings.row.focusSession, unit: t.settings.unit.min },
  { key: "shortBreakMin", label: t.settings.row.shortBreak, unit: t.settings.unit.min },
  { key: "longBreakMin", label: t.settings.row.longBreak, unit: t.settings.unit.min },
  { key: "longBreakAfter", label: t.settings.row.longBreakAfter, unit: t.settings.unit.sessions },
];

export default function SettingsScreen({
  settings,
  onClose,
  onEdit,
}: {
  settings: SettingsType;
  onClose: () => void;
  onEdit: (key: SettingsKey) => void;
}) {
  return (
    <div className="absolute inset-0 flex flex-col px-7 pt-7 pb-7">
      {/* Header */}
      <header className="relative flex items-center justify-center">
        <h1
          className="text-[26px] font-medium tracking-tight text-[color:var(--text)]"
          style={{ letterSpacing: "-0.01em" }}
        >
          {t.settings.title}
        </h1>
        <div className="absolute right-0">
          <IconButton aria-label={t.settings.aria.close} variant="outline" onClick={onClose}>
            <X size={18} strokeWidth={1.6} />
          </IconButton>
        </div>
      </header>

      {/* Single static pill — duration only */}
      <div className="mt-7 flex justify-center">
        <div
          className="inline-flex items-center rounded-full px-6 py-2 text-[11px] uppercase tracking-[0.32em] text-[color:var(--text)]"
          style={{
            background: "var(--btn)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.06), 0 6px 18px -10px rgba(0,0,0,0.6)",
          }}
        >
          {t.settings.tab.duration}
        </div>
      </div>

      {/* Rows */}
      <ul className="mt-8 flex flex-1 flex-col gap-1">
        {ROWS.map((row, i) => (
          <li key={row.key}>
            <button
              onClick={() => onEdit(row.key)}
              className="group flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left transition-colors"
              style={{
                animation: `card-in 500ms ${i * 60 + 120}ms cubic-bezier(0.22,1,0.36,1) both`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
              aria-label={`${t.settings.aria.edit} ${row.label}`}
            >
              <span
                className="text-[17px] font-medium text-[color:var(--text)]"
                style={{ letterSpacing: "-0.005em" }}
              >
                {row.label}
              </span>
              <span className="flex items-center gap-2">
                <span
                  className="tabular font-mono text-[24px] font-medium text-[color:var(--text)]"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {String(settings[row.key]).padStart(row.key === "longBreakAfter" ? 1 : 2, "0")}
                </span>
                <span className="text-[12px] text-[color:var(--muted)]">{row.unit}</span>
                <ChevronRight
                  size={18}
                  strokeWidth={1.5}
                  className="ml-1 text-[color:var(--muted)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-[color:var(--accent)]"
                />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
