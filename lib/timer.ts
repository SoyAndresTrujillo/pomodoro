"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Settings } from "./settings";

export type Phase = "focus" | "shortBreak" | "longBreak";

type Persisted = {
  phase: Phase;
  focusInRound: number;
  secondsLeft: number;
  running: boolean;
  lastTick: number; // ms epoch when secondsLeft was last accurate
};

const STORAGE_KEY = "pomodoro.timer.v1";

function durationFor(phase: Phase, s: Settings): number {
  if (phase === "focus") return s.focusMin * 60;
  if (phase === "shortBreak") return s.shortBreakMin * 60;
  return s.longBreakMin * 60;
}

function nextPhase(
  current: Phase,
  focusInRound: number,
  longBreakAfter: number
): { phase: Phase; focusInRound: number } {
  if (current === "focus") {
    const next = focusInRound + 1;
    if (next >= longBreakAfter)
      return { phase: "longBreak", focusInRound: 0 };
    return { phase: "shortBreak", focusInRound: next };
  }
  return { phase: "focus", focusInRound: current === "longBreak" ? 0 : focusInRound };
}

function defaultState(settings: Settings): Persisted {
  return {
    phase: "focus",
    focusInRound: 0,
    secondsLeft: durationFor("focus", settings),
    running: false,
    lastTick: Date.now(),
  };
}

function readStorage(settings: Settings): Persisted {
  if (typeof window === "undefined") return defaultState(settings);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState(settings);
    const parsed = JSON.parse(raw) as Persisted;
    if (!parsed.running) return parsed;

    // Catch up wall-clock elapsed seconds, simulating phase transitions.
    let elapsed = Math.max(0, Math.floor((Date.now() - parsed.lastTick) / 1000));
    let { phase, focusInRound, secondsLeft } = parsed;
    while (elapsed > 0) {
      if (elapsed < secondsLeft) {
        secondsLeft -= elapsed;
        elapsed = 0;
      } else {
        elapsed -= secondsLeft;
        const np = nextPhase(phase, focusInRound, settings.longBreakAfter);
        phase = np.phase;
        focusInRound = np.focusInRound;
        secondsLeft = durationFor(phase, settings);
      }
    }
    return { phase, focusInRound, secondsLeft, running: true, lastTick: Date.now() };
  } catch {
    return defaultState(settings);
  }
}

export function useTimer(settings: Settings) {
  const [state, setState] = useState<Persisted>(() => defaultState(settings));
  const [hydrated, setHydrated] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const settingsRef = useRef(settings);
  const prevSettingsRef = useRef(settings);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  // Hydrate once
  useEffect(() => {
    setState(readStorage(settingsRef.current));
    setHydrated(true);
  }, []);

  // Persist on every change
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state, hydrated]);

  // Tick loop
  useEffect(() => {
    if (!state.running) return;
    intervalRef.current = setInterval(() => {
      setState((prev) => {
        if (!prev.running) return prev;
        if (prev.secondsLeft > 1) {
          return {
            ...prev,
            secondsLeft: prev.secondsLeft - 1,
            lastTick: Date.now(),
          };
        }
        const np = nextPhase(
          prev.phase,
          prev.focusInRound,
          settingsRef.current.longBreakAfter
        );
        return {
          phase: np.phase,
          focusInRound: np.focusInRound,
          secondsLeft: durationFor(np.phase, settingsRef.current),
          running: true,
          lastTick: Date.now(),
        };
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.running]);

  // Sync current phase duration when settings change AND we're at pristine of old setting
  useEffect(() => {
    const prev = prevSettingsRef.current;
    prevSettingsRef.current = settings;
    if (!hydrated) return;
    setState((s) => {
      if (s.running) return s;
      const prevTotal = durationFor(s.phase, prev);
      if (s.secondsLeft === prevTotal) {
        return { ...s, secondsLeft: durationFor(s.phase, settings) };
      }
      return s;
    });
  }, [settings, hydrated]);

  const total = durationFor(state.phase, settings);
  const isPristine = !state.running && state.secondsLeft === total;

  const toggle = useCallback(() => {
    setState((prev) => ({
      ...prev,
      running: !prev.running,
      lastTick: Date.now(),
    }));
  }, []);

  const reset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      running: false,
      secondsLeft: durationFor(prev.phase, settingsRef.current),
      lastTick: Date.now(),
    }));
  }, []);

  return {
    phase: state.phase,
    focusInRound: state.focusInRound,
    secondsLeft: state.secondsLeft,
    running: state.running,
    total,
    isPristine,
    toggle,
    reset,
    hydrated,
  };
}
