import type { Request, Response } from "express";

import app from "./app.js";
import { connectDB } from "./utils/db.utils.js";
import { setServerStartTime } from "./utils/server.utils.js";

setServerStartTime();

let connected = false;

const initializeDB = async () => {
  try {
    if (!connected) {
      await connectDB();
      connected = true;
    }
  } catch (err) {
    console.error("DB connection failed:", err);
    connected = false;
    throw err;
  }
};

async function handler(req: Request, res: Response) {
  await initializeDB();
  app(req, res);
}

export default handler;
