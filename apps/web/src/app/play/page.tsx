import type { CSSProperties } from "react";

import {
  LuFootprints,
  LuHeartPulse,
  LuGauge,
  LuRoute,
  LuRepeat,
  LuTrophy,
} from "react-icons/lu";

import { FaRunning, FaWalking, FaRoad, FaFlagCheckered } from "react-icons/fa";

import { MdSpeed, MdRepeat } from "react-icons/md";

import {
  IoWalk,
  IoPulse,
  IoSpeedometer,
  IoTimer,
  IoRepeat,
  IoFlag,
} from "react-icons/io5";

import {
  PiPersonSimpleRun,
  PiHeartbeat,
  PiGauge,
  PiMapTrifold,
  PiArrowsClockwise,
  PiMedal,
} from "react-icons/pi";

const iconGroups = [
  {
    type: "base",
    icons: [
      ["LuFootprints", LuFootprints],
      ["IoWalk", IoWalk],
      ["FaRunning", FaRunning],
      ["PiPersonSimpleRun", PiPersonSimpleRun],
    ],
  },
  {
    type: "recovery",
    icons: [
      ["LuHeartPulse", LuHeartPulse],
      ["IoPulse", IoPulse],
      ["FaWalking", FaWalking],
      ["PiHeartbeat", PiHeartbeat],
    ],
  },
  {
    type: "tempo",
    icons: [
      ["LuGauge", LuGauge],
      ["IoSpeedometer", IoSpeedometer],
      ["MdSpeed", MdSpeed],
      ["PiGauge", PiGauge],
    ],
  },
  {
    type: "longRun",
    icons: [
      ["LuRoute", LuRoute],
      ["IoTimer", IoTimer],
      ["FaRoad", FaRoad],
      ["PiMapTrifold", PiMapTrifold],
    ],
  },
  {
    type: "interval",
    icons: [
      ["LuRepeat", LuRepeat],
      ["IoRepeat", IoRepeat],
      ["MdRepeat", MdRepeat],
      ["PiArrowsClockwise", PiArrowsClockwise],
    ],
  },
  {
    type: "race",
    icons: [
      ["LuTrophy", LuTrophy],
      ["IoFlag", IoFlag],
      ["FaFlagCheckered", FaFlagCheckered],
      ["PiMedal", PiMedal],
    ],
  },
];

export default function RunTypeIconPlayground() {
  return (
    <table
      style={{
        borderCollapse: "collapse",
        margin: "2rem",
      }}
    >
      <thead>
        <tr>
          <th style={cellStyle}>Type</th>
          <th style={cellStyle}>Option 1</th>
          <th style={cellStyle}>Option 2</th>
          <th style={cellStyle}>Option 3</th>
          <th style={cellStyle}>Option 4</th>
        </tr>
      </thead>
      <tbody>
        {iconGroups.map((group) => (
          <tr key={group.type}>
            <td style={cellStyle}>
              <strong>{group.type}</strong>
            </td>
            {group.icons.map(([name, Icon]) => (
              <td key={name as string} style={cellStyle}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Icon size={40} />
                  <small>{name as string}</small>
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const cellStyle: CSSProperties = {
  border: "1px solid #ccc",
  padding: "1rem",
  textAlign: "center",
};
