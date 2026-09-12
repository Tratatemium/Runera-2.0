"use client";

import { useAuthContext } from "@/context/AuthContext";

import styles from "./PaceScale.module.css";

function formatMMSS(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function deltaToBarPercent(paceDeltaSec: number, capSec = 120) {
  const clamped = Math.max(-capSec, Math.min(capSec, paceDeltaSec));
  return (Math.abs(clamped) / capSec) * 50;
}

function paceBarConfig(paceDeltaSec: number) {
  const isFaster = paceDeltaSec < 0;
  return {
    color: isFaster ? "#5DCAA5" : "#F0997B",
    direction: isFaster ? "left" : "right",
    widthPercent: deltaToBarPercent(paceDeltaSec),
    label: `${isFaster ? "-" : "+"}${formatMMSS(Math.abs(paceDeltaSec))}/km ${isFaster ? "faster" : "slower"}`,
  };
}

interface PaceScaleProps extends React.HTMLAttributes<HTMLDivElement> {
  paceSecPerKm: number;
}

function PaceScale({ paceSecPerKm, ...props }: PaceScaleProps) {
  const { user } = useAuthContext();
  if (!user?.stats.allTime.avgPaceSecPerKm) return null;
  const avgPaceSecPerKm = user?.stats.allTime.avgPaceSecPerKm;

  const paceDeltaSec = paceSecPerKm - avgPaceSecPerKm;
  const config = paceBarConfig(paceDeltaSec);

  return (
    <div className={styles.wrapper} {...props}>
      <span className={styles.title}>Pace vs your avg</span>
      <div className={styles.paceTrack}>
        <div
          className={styles.paceFill}
          style={{
            background: config.color,
            width: `${config.widthPercent}%`,
            [config.direction === "left" ? "right" : "left"]: "50%",
          }}
        />
        <div className={styles.centerTick} />
      </div>
      <span className={styles.label} style={{ color: config.color }}>
        {config.label}
      </span>
    </div>
  );
}

export { PaceScale };
