import type { CSSProperties } from "react";

import { RequireAuth } from "@/components/auth";
import bg from "@/assets/bg1.png";

import styles from "./layout.module.css";

export default function UserLayout({ children }: LayoutProps<"/user">) {
  return (
    <RequireAuth>
      <div
        className={styles.layout}
        style={
          { "--layout-background-image": `url(${bg.src})` } as CSSProperties
        }
      >
        {children}
      </div>
    </RequireAuth>
  );
}
