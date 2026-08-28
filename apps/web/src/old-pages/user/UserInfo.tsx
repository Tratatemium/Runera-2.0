import styles from "./UserInfo.module.css";

import { useAuthContext } from "../../context/AuthContext";
import { ButtonLink, Panel } from "../../components/ui";

function UserInfo() {
  const { user } = useAuthContext();
  if (!user) return null;

  const { account, profile } = user;

  const fullName =
    profile.firstName || profile.lastName
      ? [profile.firstName, profile.lastName].filter(Boolean).join(" ")
      : null;

  return (
    <main className={styles.main}>
      <Panel variant="frosted">
        <div className={styles.avatar}>
          {(profile.firstName?.[0] ?? account.username[0]).toUpperCase()}
        </div>
        <h1 className={styles.name}>{fullName ?? account.username}</h1>
        <p className={styles.username}>@{account.username}</p>
        <div className={styles.actions}>
          <ButtonLink
            linkDirection="/user/edit-profile"
            linkText="Edit Profile"
            variant="primary"
          />
          <ButtonLink
            linkDirection="/user/edit-account"
            linkText="Edit Account"
            variant="secondary"
          />
        </div>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Email</span>
            <span className={styles.infoValue}>{account.email}</span>
          </div>
          {profile.dateOfBirth && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Date of Birth</span>
              <span className={styles.infoValue}>
                {new Date(profile.dateOfBirth).toLocaleDateString()}
              </span>
            </div>
          )}
          {profile.heightCm && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Height</span>
              <span className={styles.infoValue}>{profile.heightCm} cm</span>
            </div>
          )}
          {profile.weightKg && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Weight</span>
              <span className={styles.infoValue}>{profile.weightKg} kg</span>
            </div>
          )}
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Role</span>
            <span className={styles.infoValue}>{user.role}</span>
          </div>
        </div>
      </Panel>
    </main>
  );
}

export { UserInfo };
