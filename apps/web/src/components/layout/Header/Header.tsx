"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuthContext } from "@/context/AuthContext";
import { icons } from "@/components/icons/icons";
import { UserMenu } from "@/components/auth";
import { Logo, ButtonLink } from "@/components/ui";

import styles from "./Header.module.css";

function Header() {
  const pathname = usePathname();
  const { user } = useAuthContext();

  const { list: ListIcon, dashboard: DashboardIcon } = icons.general;

  return (
    <header className={styles.header}>
      <Link href={"/"}>
        <Logo variant="secondary" />
      </Link>
      <div className={styles.headerContent}>
        {user ? (
          <>
            <ButtonLink
              linkDirection="/user/dashboard"
              active={pathname === "/user/dashboard"}
              linkText="Dashboard"
              variant="transparent"
              size="small"
            >
              <DashboardIcon />
            </ButtonLink>

            <ButtonLink
              linkDirection="/user/runs"
              active={pathname === "/user/runs"}
              linkText="My Runs"
              variant="transparent"
              size="small"
            >
              <ListIcon />
            </ButtonLink>

            <UserMenu />
          </>
        ) : (
          <ButtonLink
            linkDirection="/login"
            linkText="Log In"
            variant="primary"
            size="small"
          />
        )}
      </div>
    </header>
  );
}

export { Header };
