import mongoose from "mongoose";

const transformRun = (_: unknown, ret: Record<string, unknown>) => {
  const result = ret as { _id?: unknown; __v?: unknown };
  delete result._id;
  delete result.__v;
  return result;
};

const RunSchema = new mongoose.Schema(
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
