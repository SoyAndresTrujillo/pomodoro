"use client";

import { useCallback, useEffect, useState } from "react";

export type SettingsKey =
  | "focusMin"
  | "shortBreakMin"
  | "longBreakMin"
  | "longBreakAfter";

export type Settings = Record<SettingsKey, number>;

export const DEFAULT_SETTINGS: Settings = {
  focusMin: 25,
  shortBreakMin: 5,
  longBreakMin: 15,
  longBreakAfter: 4,
};

export const SETTINGS_BOUNDS: Record<SettingsKey, { min: number; max: number; step: number }> = {
  focusMin: { min: 1, max: 90, step: 1 },
  shortBreakMin: { min: 1, max: 30, step: 1 },
  longBreakMin: { min: 1, max: 60, step: 1 },
  longBreakAfter: { min: 2, max: 12, step: 1 },
};

const STORAGE_KEY = "pomodoro.settings.v1";

function readStorage(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSettings(readStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore quota / private mode
    }
  }, [settings, hydrated]);

  const updateSetting = useCallback((key: SettingsKey, value: number) => {
    const { min, max } = SETTINGS_BOUNDS[key];
    const clamped = Math.max(min, Math.min(max, Math.round(value)));
    setSettings((prev) => ({ ...prev, [key]: clamped }));
  }, []);

  return { settings, updateSetting, hydrated };
}
