"use client";

import { useState } from "react";
import type {
  UpdateRunningProfileRequest,
  UserState,
} from "@runera/shared";

import { useAuthContext } from "@/context/AuthContext";
import { useUser } from "@/hooks";
import { Button, ButtonLink, Panel } from "@/components/ui";

import styles from "./page.module.css";

const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const RUN_TYPES = ["easy", "long", "tempo", "intervals"] as const;
const HEALTH_ITEMS = [
  "previous_injury",
  "current_injury",
  "breathing",
  "joint_mobility",
  "other",
] as const;

type Weekday = (typeof WEEKDAYS)[number];
type RunType = (typeof RUN_TYPES)[number];
type HealthItem = (typeof HEALTH_ITEMS)[number];

type RunningForm = {
  availableDays: Weekday[];
  runsPerWeek: string;
  longRunDay: Weekday;
  maxRunMinutes: string;
  runTypes: RunType[];
  runningNotes: string;
  healthStatus: "yes" | "no";
  healthItems: HealthItem[];
  healthNotes: string;
};

const labelMap: Record<string, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
  easy: "Easy runs",
  long: "Long runs",
  tempo: "Tempo",
  intervals: "Intervals",
  previous_injury: "Previous running injury",
  current_injury: "Current injury",
  breathing: "Asthma / breathing limitation",
  joint_mobility: "Joint or mobility limitation",
  other: "Other",
};

function createInitialForm(user: UserState | null): RunningForm {
  const preferences = user?.runningPreferences;
  const health = user?.health;

  return {
    availableDays: (preferences?.constraints.availableDays ?? []) as Weekday[],
    runsPerWeek: preferences?.preferences.runsPerWeek?.toString() ?? "flexible",
    longRunDay: preferences?.preferences.longRunDay ?? "sunday",
    maxRunMinutes: preferences?.constraints.maxRunMinutes?.toString() ?? "60",
    runTypes: (preferences?.preferences.runTypes ?? []) as RunType[],
    runningNotes: preferences?.notes ?? "",
    healthStatus: health && health.items.length > 0 ? "yes" : "no",
    healthItems: (health?.items ?? []) as HealthItem[],
    healthNotes: health?.notes ?? "",
  };
}

export default function EditRunningProfile() {
  const { user } = useAuthContext();
  const { isFetching, formError, updateRunningProfile } = useUser();
  const [form, setForm] = useState(() => createInitialForm(user));

  function toggleArrayValue<Key extends "availableDays" | "runTypes" | "healthItems">(
    key: Key,
    value: RunningForm[Key][number],
  ) {
    setForm((current) => {
      const values = current[key] as string[];
      const nextValues = values.includes(value as string)
        ? values.filter((item) => item !== value)
        : [...values, value as string];

      return { ...current, [key]: nextValues };
    });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const payload: UpdateRunningProfileRequest = {
      runningPreferences: {
        constraints: {
          availableDays: form.availableDays,
          maxRunMinutes: Number(form.maxRunMinutes),
        },
        preferences: {
          runsPerWeek:
            form.runsPerWeek === "flexible"
              ? "flexible"
              : Number(form.runsPerWeek),
          longRunDay: form.longRunDay,
          runTypes: form.runTypes,
        },
        notes: form.runningNotes,
      },
      health: {
        items: form.healthStatus === "yes" ? form.healthItems : [],
        notes: form.healthNotes,
      },
    };

    await updateRunningProfile(payload);
  }

  return (
    <main className={styles.main}>
      <Panel variant="frosted" className={styles.panel}>
        <header className={styles.header}>
          <h1 className={styles.title}>Training Preferences</h1>
          <p className={styles.subtitle}>
            Help us shape a plan that fits your life and your running.
          </p>
        </header>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>When can you run?</span>
              <span className={styles.hint}>Select all that apply</span>
            </div>
            <div className={styles.choiceGrid}>
              {WEEKDAYS.map((day) => (
                <label
                  className={`${styles.choice} ${form.availableDays.includes(day) ? styles.selected : ""}`}
                  key={day}
                >
                  <input
                    type="checkbox"
                    checked={form.availableDays.includes(day)}
                    onChange={() => toggleArrayValue("availableDays", day)}
                  />
                  <span>{labelMap[day]}</span>
                </label>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <span className={styles.sectionLabel}>Runs per week</span>
            <div className={styles.controlRow}>
              <input
                className={styles.numberInput}
                type="number"
                min="1"
                max="14"
                value={form.runsPerWeek === "flexible" ? "" : form.runsPerWeek}
                placeholder="4"
                disabled={form.runsPerWeek === "flexible"}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    runsPerWeek: e.target.value,
                  }))
                }
              />
              <span className={styles.unit}>runs</span>
              <button
                className={`${styles.toggleButton} ${form.runsPerWeek === "flexible" ? styles.active : ""}`}
                type="button"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    runsPerWeek:
                      current.runsPerWeek === "flexible" ? "4" : "flexible",
                  }))
                }
              >
                Flexible
              </button>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Preferred long run day</span>
              <span className={styles.hint}>Optional</span>
            </div>
            <div className={styles.choiceGrid}>
              {WEEKDAYS.map((day) => (
                <label
                  className={`${styles.choice} ${form.longRunDay === day ? styles.selected : ""}`}
                  key={day}
                >
                  <input
                    type="radio"
                    name="longRunDay"
                    checked={form.longRunDay === day}
                    onChange={() =>
                      setForm((current) => ({ ...current, longRunDay: day }))
                    }
                  />
                  <span>{labelMap[day]}</span>
                </label>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <span className={styles.sectionLabel}>Maximum time available for a run</span>
            <div className={styles.controlRow}>
              <input
                className={styles.numberInput}
                type="number"
                min="1"
                max="999"
                value={form.maxRunMinutes}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    maxRunMinutes: e.target.value,
                  }))
                }
              />
              <span className={styles.unit}>minutes</span>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Training I enjoy</span>
              <span className={styles.hint}>Optional</span>
            </div>
            <div className={styles.checkList}>
              {RUN_TYPES.map((type) => (
                <label className={styles.checkItem} key={type}>
                  <input
                    type="checkbox"
                    checked={form.runTypes.includes(type)}
                    onChange={() => toggleArrayValue("runTypes", type)}
                  />
                  <span>{labelMap[type]}</span>
                </label>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Health & injury considerations</span>
              <span className={styles.hint}>Optional</span>
            </div>
            <div className={styles.healthChoiceRow}>
              {(["no", "yes"] as const).map((status) => (
                <label
                  className={`${styles.choice} ${form.healthStatus === status ? styles.selected : ""}`}
                  key={status}
                >
                  <input
                    type="radio"
                    name="healthStatus"
                    checked={form.healthStatus === status}
                    onChange={() =>
                      setForm((current) => ({ ...current, healthStatus: status }))
                    }
                  />
                  <span>{status === "yes" ? "Yes" : "No"}</span>
                </label>
              ))}
            </div>
            {form.healthStatus === "yes" && (
              <div className={styles.checkList}>
                {HEALTH_ITEMS.map((item) => (
                  <label className={styles.checkItem} key={item}>
                    <input
                      type="checkbox"
                      checked={form.healthItems.includes(item)}
                      onChange={() => toggleArrayValue("healthItems", item)}
                    />
                    <span>{labelMap[item]}</span>
                  </label>
                ))}
              </div>
            )}
            <textarea
              className={styles.textarea}
              value={form.healthNotes}
              placeholder="Additional information (optional)"
              rows={4}
              onChange={(e) =>
                setForm((current) => ({ ...current, healthNotes: e.target.value }))
              }
            />
          </section>

          <section className={styles.section}>
            <span className={styles.sectionLabel}>Anything else?</span>
            <textarea
              className={styles.textarea}
              value={form.runningNotes}
              placeholder="Tell us anything else about your training preferences"
              rows={3}
              onChange={(e) =>
                setForm((current) => ({ ...current, runningNotes: e.target.value }))
              }
            />
          </section>

          <div className={styles.submitWrapper}>
            {formError && (
              <p className={styles.errorText} role="alert">
                {formError}
              </p>
            )}
            <div className={styles.submit}>
              <Button
                buttonText="Save changes"
                type="submit"
                variant="primary"
                isSubmitting={isFetching}
              />
              <ButtonLink
                linkDirection="."
                linkText="Cancel"
                variant="secondary"
                goBack={true}
              />
            </div>
          </div>
        </form>
      </Panel>
    </main>
  );
}