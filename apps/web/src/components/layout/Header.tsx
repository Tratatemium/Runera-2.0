import styles from "./Header.module.css";
import { icons } from "../icons/icons";

import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

import { UserMenu } from "../auth";
import { Logo, ButtonLink } from "../ui/";

function Header() {
  const location = useLocation();
  const { user } = useAuthContext();

  const ListIcon = icons.list;
  const DashboardIcon = icons.dashboard;

  return (
    <header className={styles.header}>
      <Link to={"/"}>
        <Logo variant="secondary" />
      </Link>
      <div className={styles.headerContent}>
        {user ? (
          <>
            <ButtonLink
              linkDirection="/user/dashboard"
              active={location.pathname === "/user/dashboard"}
              linkText="Dashboard"
              variant="transparent"
              size="small"
            >
              <DashboardIcon />
            </ButtonLink>

            <ButtonLink
              linkDirection="/user/runs"
              active={location.pathname === "/user/runs"}
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
