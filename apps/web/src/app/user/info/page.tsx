"use client";

import { useAuthContext } from "@/context/AuthContext";
import { ButtonLink, Panel, Card } from "@/components/ui";
import { formatLabel } from "@/utils/normalize.utils";

import styles from "./page.module.css";

export default function UserInfo() {
  const { user } = useAuthContext();
  if (!user) return null;

  const { account, profile } = user;

  const fullName =
    profile.firstName || profile.lastName
      ? [profile.firstName, profile.lastName].filter(Boolean).join(" ")
      : null;

  const profileMap = [
    {
      label: "Email",
      value: account.email,
    },
    {
      label: "Date of Birth",
      value: profile.dateOfBirth
        ? new Date(profile.dateOfBirth).toLocaleDateString()
        : "-",
    },
    {
      label: "Height",
      value: profile.heightCm ? `${profile.heightCm} cm` : "-",
    },
    {
      label: "Weight",
      value: profile.weightKg ? `${profile.weightKg} kg` : "-",
    },
    {
      label: "Gender",
      value: profile.gender ? formatLabel(profile.gender) : "-",
    },
    {
      label: "Running Experience",
      value: profile.runningExperience
        ? formatLabel(profile.runningExperience)
        : "-",
    },
  ];

  const WEEKDAYS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ] as const;

  const checkIfAvalible = (weekday: (typeof WEEKDAYS)[number]) =>
    user.runningPreferences?.constraints?.availableDays?.includes(weekday);

  const cards = [
    {
      cardLabel: "Runs / week",
      cardValue:
        user.runningPreferences?.preferences?.runsPerWeek?.toString() ?? "—",
      cardUnit: "",
    },
    {
      cardLabel: "Long run day",
      cardValue: user.runningPreferences?.preferences?.longRunDay ?? "—",
      cardUnit: "",
    },
    {
      cardLabel: "Max run",
      cardValue:
        user.runningPreferences?.constraints?.maxRunMinutes?.toString() ?? "—",
      cardUnit: user.runningPreferences?.constraints?.maxRunMinutes
        ? "min"
        : "",
    },
  ];

  const runTypes = user.runningPreferences?.preferences?.runTypes ?? [];
  const healthItems = user.health?.items ?? [];

  return (
    <main className={styles.main}>
      <Panel variant="opaqueAccent" className={styles.panel}>
        <Panel variant="accent" className={styles.panel}>
          <div className={styles.avatar}>
            {(profile.firstName?.[0] ?? account.username[0]).toUpperCase()}
          </div>
          <h1 className={styles.name}>{fullName ?? account.username}</h1>
          <p className={styles.username}>@{account.username}</p>
          <div className={styles.actions}>
            <ButtonLink
              linkDirection="/user/edit-profile"
              linkText="Edit Profile"
              variant="secondary"
            />
            <ButtonLink
              linkDirection="/user/edit-account"
              linkText="Edit Account"
              variant="secondary"
            />
          </div>
        </Panel>

        <Panel variant="accent" className={`${styles.panel} ${styles.profile}`}>
          <header className={styles.panelHeader}>
            <span className={styles.panelLabel}>Profile</span>
            <span>Edit</span>
          </header>

          <div className={styles.infoGrid}>
            {profileMap.map((item) => (
              <div className={styles.infoItem} key={item.label}>
                <span className={styles.infoLabel}>{item.label}</span>
                <span className={styles.infoValue}>{item.value}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          variant="frostedAccent"
          className={`${styles.panel} ${styles.preferences}`}
        >
          <header className={styles.panelHeader}>
            <span className={styles.panelLabel}>Training Preferences</span>
            <ButtonLink
              linkDirection="/user/edit-running-profile"
              linkText="Edit"
              variant="transparentAccent"
            />
          </header>
          <div className={styles.avalibleDays}>
            <span className={styles.prefLabel}>AvalibleDays</span>
            <div className={styles.daysWrapper}>
              {WEEKDAYS.map((weekday) => (
                <span
                  key={weekday}
                  className={`${styles.weekday} ${checkIfAvalible(weekday) ? styles.avalible : ""}`}
                >
                  {weekday.slice(0, 3)}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.otherPrefsWrapper}>
            {cards.map((card) => (
              <Card key={card.cardLabel} variant="userPref" {...card} />
            ))}
          </div>

          <div className={styles.preferenceDetails}>
            <div className={styles.detailBlock}>
              <span className={styles.infoLabel}>Run types</span>
              <div className={styles.detailTags}>
                {runTypes.length > 0 ? (
                  runTypes.map((runType) => (
                    <span className={styles.detailTag} key={runType}>
                      {formatLabel(runType)}
                    </span>
                  ))
                ) : (
                  <span className={styles.infoValue}>None added</span>
                )}
              </div>
            </div>

            <div className={styles.detailBlock}>
              <span className={styles.infoLabel}>Training notes</span>
              <span className={styles.infoValue}>
                {user.runningPreferences?.notes || "None added"}
              </span>
            </div>

            <div className={styles.detailBlock}>
              <span className={styles.infoLabel}>Health considerations</span>
              <div className={styles.detailTags}>
                {healthItems.length > 0 ? (
                  healthItems.map((item) => (
                    <span className={styles.detailTag} key={item}>
                      {formatLabel(item)}
                    </span>
                  ))
                ) : (
                  <span className={styles.infoValue}>None reported</span>
                )}
              </div>
            </div>

            {user.health?.notes && (
              <div className={styles.detailBlock}>
                <span className={styles.infoLabel}>Health notes</span>
                <span className={styles.infoValue}>{user.health.notes}</span>
              </div>
            )}
          </div>
        </Panel>
      </Panel>
    </main>
  );
}
