"use client";
import { useState } from "react";
import type { ProgramRequestData } from "@/components/program/Program";
import { useAuthContext } from "@/context/AuthContext";
import { useRunsContext } from "@/context/RunsContext";

import { Panel } from "@/components/ui";
import { Program } from "@/components/program/Program";

import styles from "./page.module.css";

export default function TrainingProgram() {
  const { user } = useAuthContext();
  const { runs } = useRunsContext();
  const [request, setRequest] = useState<ProgramRequestData | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  if (!user || !runs) return;

  const currentUser = user;

  const lastRuns = Object.values(runs)
    .sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    )
    .slice(0, 10);

  const safeProfile = {
    dateOfBirth: currentUser.profile.dateOfBirth,
    heightCm: currentUser.profile.heightCm,
    weightKg: currentUser.profile.weightKg,
    gender: currentUser.profile.gender,
    runningExperience: currentUser.profile.runningExperience,
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const goal = String(formData.get("goal") ?? "").trim();
    const startDate = String(formData.get("startDate") ?? "");
    const endDate = String(formData.get("endDate") ?? "");

    if (!goal || !startDate || !endDate) {
      setFormError("Add a goal, start date, and end date to continue.");
      return;
    }

    if (endDate < startDate) {
      setFormError("The end date must be after the start date.");
      return;
    }

    setFormError(null);
    setRequest({
      goal,
      startDate,
      endDate,
      lastRuns,
      profile: safeProfile,
      runningPreferences: currentUser.runningPreferences,
      healthConsiderations: currentUser.health,
    });
  }

  return (
    <main className={styles.main}>
      <Panel variant="opaqueAccent" className={styles.panel}>
        {!request ? (
          <form className={styles.goalForm} onSubmit={handleSubmit}>
            <header className={styles.formHeader}>
              <p className={styles.eyebrow}>Build your plan</p>
              <h1>What are you training for?</h1>
              <p>Set your goal and the dates you want your plan to cover.</p>
            </header>

            <label className={styles.field}>
              <span>Goal description</span>
              <textarea
                name="goal"
                placeholder="For example: Run my first half marathon"
                rows={4}
                required
              />
            </label>

            <div className={styles.dateFields}>
              <label className={styles.field}>
                <span>Start date</span>
                <input name="startDate" type="date" required />
              </label>
              <label className={styles.field}>
                <span>End date</span>
                <input name="endDate" type="date" required />
              </label>
            </div>

            {formError && (
              <p className={styles.formError} role="alert">
                {formError}
              </p>
            )}

            <button className={styles.submit} type="submit">
              Continue to plan
            </button>
          </form>
        ) : (
          <Program data={request} />
        )}
      </Panel>
    </main>
  );
}
