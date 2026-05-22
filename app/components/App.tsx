"use client";

import { useState } from "react";
import Card from "./Card";
import Timer from "./Timer";
import SettingsScreen from "./Settings";
import EditTime from "./EditTime";
import { useSettings, SettingsKey } from "@/lib/settings";
import { useTimer } from "@/lib/timer";

type Screen =
  | { kind: "timer" }
  | { kind: "settings" }
  | { kind: "edit"; key: SettingsKey };

export default function App() {
  const { settings, updateSetting } = useSettings();
  const timer = useTimer(settings);
  const [screen, setScreen] = useState<Screen>({ kind: "timer" });

  return (
    <Card>
      {screen.kind === "timer" && (
        <Timer
          phase={timer.phase}
          secondsLeft={timer.secondsLeft}
          total={timer.total}
          running={timer.running}
          isPristine={timer.isPristine}
          focusInRound={timer.focusInRound}
          longBreakAfter={settings.longBreakAfter}
          onToggle={timer.toggle}
          onReset={timer.reset}
          onOpenSettings={() => setScreen({ kind: "settings" })}
        />
      )}

      {screen.kind === "settings" && (
        <SettingsScreen
          settings={settings}
          onClose={() => setScreen({ kind: "timer" })}
          onEdit={(key) => setScreen({ kind: "edit", key })}
        />
      )}

      {screen.kind === "edit" && (
        <EditTime
          settingKey={screen.key}
          value={settings[screen.key]}
          onBack={() => setScreen({ kind: "settings" })}
          onChange={(next) => updateSetting(screen.key, next)}
        />
      )}
    </Card>
  );
}
