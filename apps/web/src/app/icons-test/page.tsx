"use client";

import type { CSSProperties, JSX } from "react";
import { Fragment } from "react";

import { icons } from "@/components/icons/icons";

type PlaygroundIcon = (props: {
  width?: number;
  height?: number;
}) => JSX.Element;

function toTitleCase(key: string): string {
  return key.replace(/^./, (c) => c.toUpperCase());
}

const iconGroups: { title: string; entries: [string, PlaygroundIcon][] }[] =
  Object.entries(icons).map(([groupName, groupIcons]) => ({
    title: toTitleCase(groupName),
    entries: Object.entries(groupIcons) as unknown as [
      string,
      PlaygroundIcon,
    ][],
  }));

export default function IconPlayground() {
  return (
    <table
      style={{
        borderCollapse: "collapse",
        margin: "2rem",
      }}
    >
      <tbody>
        {iconGroups.map((group) => (
          <Fragment key={group.title}>
            <tr>
              <th style={cellStyle} colSpan={group.entries.length}>
                {group.title}
              </th>
            </tr>
            <tr>
              {group.entries.map(([name, Icon]) => (
                <td key={name} style={cellStyle}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Icon width={40} height={40} />
                    <small>{name}</small>
                  </div>
                </td>
              ))}
            </tr>
          </Fragment>
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
