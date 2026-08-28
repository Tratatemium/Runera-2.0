import bg from "@/assets/bg1.png";

import styles from "./layout.module.css";

export default function UsersLayout({ children }: LayoutProps<"/">) {
  return (
    <div className={styles.layout} style={{ backgroundImage: `url(${bg})` }}>
      {children}
    </div>
  );
}
