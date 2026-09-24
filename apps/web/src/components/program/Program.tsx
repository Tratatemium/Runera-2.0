import type {
  Run,
  UserProfile,
  RunningPreferences,
  HealthConsiderations,
} from "@runera/shared";

import { useState } from "react";

import { GoogleGenAI, ThinkingLevel } from "@google/genai";

import { Button } from "@/components/ui";

import styles from "./Program.module.css";

type PlannedRun = {
  date: string; // YYYY-MM-DD
  runType: "base" | "recovery" | "tempo" | "longRun" | "interval" | "race";

  title: string;
  description: string;

  distanceKm?: number;
  durationMin?: number;

  // For easy runs / recovery / long runs
  targetPaceSecPerKm?: number;

  // For effort-based workouts
  targetEffort?: number; // 1–10

  // For intervals / tempo workouts
  warmupMin?: number;
  cooldownMin?: number;

  intervals?: {
    repetitions: number;
    work: {
      durationSec?: number;
      distanceMeters?: number;
      paceSecPerKm?: number;
      effort?: number;
    };
    recovery: {
      durationSec: number;
      paceSecPerKm?: number;
    };
  };

  notes?: string;
};

type TrainingWeek = {
  weekNumber: number;
  startDate: string;
  endDate: string;

  focus: string;
  totalDistanceKm?: number;
  runs: PlannedRun[];
};

type TrainingProgram = {
  name: string;

  goal: string;

  startDate: string;
  endDate: string;

  summary: string;

  weeks: TrainingWeek[];
};

interface ProgramRequestData {
  goal: string;
  startDate: string;
  endDate: string;
  lastRuns: Run[];
  profile: Omit<UserProfile, "firstName" | "lastName">;
  runningPreferences: RunningPreferences;
  healthConsiderations?: HealthConsiderations;
}

async function getTrainingProgram(
  data: ProgramRequestData,
): Promise<TrainingProgram> {
  const ai = new GoogleGenAI({
    apiKey: process.env["GEMINI_API_KEY"],
  });
  const config = {
    thinkingConfig: {
      thinkingLevel: ThinkingLevel.MEDIUM,
    },
    audioTranscriptionConfig: {},
    responseMimeType: "application/json",
    responseSchema: {
      type: "OBJECT",
      properties: {
        name: { type: "STRING" },
        goal: { type: "STRING" },
        startDate: { type: "STRING" },
        endDate: { type: "STRING" },
        summary: { type: "STRING" },
        weeks: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              weekNumber: { type: "INTEGER" },
              startDate: { type: "STRING" },
              endDate: { type: "STRING" },
              focus: { type: "STRING" },
              totalDistanceKm: { type: "NUMBER" },
              runs: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    date: { type: "STRING" },
                    runType: {
                      type: "STRING",
                      enum: [
                        "base",
                        "recovery",
                        "tempo",
                        "longRun",
                        "interval",
                        "race",
                      ],
                    },
                    title: { type: "STRING" },
                    description: { type: "STRING" },
                    distanceKm: { type: "NUMBER" },
                    durationMin: { type: "NUMBER" },
                    targetPaceSecPerKm: { type: "NUMBER" },
                    targetEffort: { type: "NUMBER" },
                    warmupMin: { type: "NUMBER" },
                    cooldownMin: { type: "NUMBER" },
                    intervals: {
                      type: "OBJECT",
                      properties: {
                        repetitions: { type: "INTEGER" },
                        work: {
                          type: "OBJECT",
                          properties: {
                            durationSec: { type: "NUMBER" },
                            distanceMeters: { type: "NUMBER" },
                            paceSecPerKm: { type: "NUMBER" },
                            effort: { type: "NUMBER" },
                          },
                        },
                        recovery: {
                          type: "OBJECT",
                          properties: {
                            durationSec: { type: "NUMBER" },
                            paceSecPerKm: { type: "NUMBER" },
                          },
                          required: ["durationSec"],
                        },
                      },
                      required: ["repetitions", "work", "recovery"],
                    },
                    notes: { type: "STRING" },
                  },
                  required: ["date", "runType", "title", "description"],
                },
              },
            },
            required: ["weekNumber", "startDate", "endDate", "focus", "runs"],
          },
        },
      },
      required: ["name", "goal", "startDate", "endDate", "summary", "weeks"],
    },
    systemInstruction: [
      {
        text: `You need to take into account all information provided, including chronic and acute conditions, gender, age, weight and fitness levels.
Suggest exercises that are good for preventing injuries that user is prone for. Do not suggest exercises that can aggravate users injuries. 
Keep to the desired sports, days of the weeks and limitations. Keep user goals in mind.
If latest workouts information provided, analyze it carefully. Pay attention how they are different from what was planned and adapt to user's current ability and provided feedback. 
For time units, prefer minutes over seconds if amount of time is 3 minutes or more. For distance units, prefer kilometers over meters is the distance is 1 kilometer or more.
Use *metric* units for distance and weight.
Week start day is Monday

You are a helpful personal trainer. Create a training program for a user with provided parameters. The program *must* be the same length as requested
Provide by-week overview of training and goals, and detailed workout instructions for the first week.
If the start of the program happens not on Monday, then the first week should be a short one and end on Sunday. If the end date falls not on Sunday then the last week will be a shorter one and end on planned end day. All other weeks must be full seven day weeks from Monday to Sunday.`,
      },
    ],
  };
  const model = "gemini-3.5-flash-lite";
  const contents = [
    {
      role: "user",
      parts: [
        {
          text: JSON.stringify(data),
        },
      ],
    },
  ];

  const response = await ai.models.generateContent({
    model,
    config,
    contents,
  });

  const responseText = response.text;
  if (!responseText) {
    throw new Error("The training program response was empty.");
  }

  return JSON.parse(responseText) as TrainingProgram;
}

interface ProgramProps {
  data: ProgramRequestData;
}

function Program({ data }: ProgramProps) {
  const [program, setProgram] = useState<TrainingProgram | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setIsLoading(true);
    setError(null);

    try {
      const generatedProgram = await getTrainingProgram(data);
      setProgram(generatedProgram);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to generate a training program.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <Button
        buttonText="Get training program"
        variant="primary"
        isSubmitting={isLoading}
        onClick={handleGenerate}
      />

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {program && (
        <article className={styles.program}>
          <header className={styles.programHeader}>
            <p className={styles.eyebrow}>Training program</p>
            <h2>{program.name}</h2>
            <p className={styles.summary}>{program.summary}</p>
            <p className={styles.dateRange}>
              {program.startDate} to {program.endDate}
            </p>
          </header>

          <div className={styles.weeks}>
            {program.weeks.map((week) => (
              <section className={styles.week} key={week.weekNumber}>
                <div className={styles.weekHeader}>
                  <div>
                    <p className={styles.eyebrow}>Week {week.weekNumber}</p>
                    <h3>{week.focus}</h3>
                  </div>
                  <span className={styles.weekDates}>
                    {week.startDate} to {week.endDate}
                  </span>
                </div>

                <div className={styles.runs}>
                  {week.runs.map((run) => (
                    <article
                      className={styles.run}
                      key={`${run.date}-${run.title}`}
                    >
                      <div className={styles.runHeader}>
                        <div>
                          <p className={styles.runDate}>{run.date}</p>
                          <h4>{run.title}</h4>
                        </div>
                        <span className={styles.runType}>{run.runType}</span>
                      </div>
                      <p className={styles.description}>{run.description}</p>
                      <div className={styles.metrics}>
                        {run.distanceKm !== undefined && (
                          <span>{run.distanceKm} km</span>
                        )}
                        {run.durationMin !== undefined && (
                          <span>{run.durationMin} min</span>
                        )}
                        {run.targetEffort !== undefined && (
                          <span>Effort {run.targetEffort}/10</span>
                        )}
                      </div>
                      {run.notes && <p className={styles.notes}>{run.notes}</p>}
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      )}
    </div>
  );
}

export { Program };
export type { ProgramRequestData };
