import bg from "@/assets/bg1.png";

import styles from "./layout.module.css";

export default function UserLayout({ children }: LayoutProps<"/user">) {
  return (
    <div className={styles.layout} style={{ backgroundImage: `url(${bg})` }}>
      {children}
    </div>
  );
}
