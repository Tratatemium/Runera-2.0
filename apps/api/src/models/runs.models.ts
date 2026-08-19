import mongoose from "mongoose";

interface DBRun {
  runId: string;
  userId: string;
  startTime: Date;
  date: Date;
  durationSec: number;
  distanceMeters: number;
  paceSecPerKm: number;
  title?: string;
  notes?: string;
  perceivedEffort?: number;
  weather?:
    | "sunny"
    | "partly_cloudy"
    | "cloudy"
    | "rain"
    | "snow"
    | "windy"
    | "hot"
    | "cold";
  _id: string;
  __v: number;
}

function transformRun(_: unknown, ret: DBRun) {
  const { _id, __v, ...run } = ret;
  return run;
}

const RunSchema = new mongoose.Schema<DBRun>(
  {
    runId: { type: String, required: true },
    userId: { type: String, required: true },

    startTime: { type: Date, required: true, default: Date.now },
    date: { type: Date, required: true },

    durationSec: { type: Number, required: true, min: 1 },
    distanceMeters: { type: Number, required: true, min: 1 },

    paceSecPerKm: { type: Number, required: true, min: 0 },

    title: String,
    notes: String,

    perceivedEffort: {
      type: Number,
      min: 1,
      max: 10,
    },

    weather: {
      type: String,
      enum: [
        "sunny",
        "partly_cloudy",
        "cloudy",
        "rain",
        "snow",
        "windy",
        "hot",
        "cold",
      ],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: transformRun,
    },
    toObject: {
      transform: transformRun,
    },
  },
);

RunSchema.index({ runId: 1 }, { unique: true });
// Optional compound index for user + startTime queries
RunSchema.index({ userId: 1, startTime: -1 });

export default mongoose.model("Run", RunSchema);

export type { DBRun };
