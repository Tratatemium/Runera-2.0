import mongoose, { Mongoose } from "mongoose";

type MongoCache = { conn: Mongoose | null; promise: Promise<Mongoose> | null };

declare global {
  var _mongo: MongoCache | undefined;
}

let cached: MongoCache =
  global._mongo ?? (global._mongo = { conn: null, promise: null });

async function connectDB(uri = process.env.MONGO_URI) {
  if (!uri) throw new Error("MongoDB URI not provided");

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        dbName: "runners-app",
      })
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    cached.conn = null;
    throw err;
  }

  console.log("Connected to database (Mongoose).");
  return cached.conn;
}

async function checkDBConnection() {
  const states: Record<number, string> = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  return states[mongoose.connection.readyState];
}

async function closeDB() {
  await mongoose.connection.close();
  cached.conn = null;
  cached.promise = null;
}

async function clearDB() {
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
}

export { connectDB, checkDBConnection, closeDB, clearDB };
