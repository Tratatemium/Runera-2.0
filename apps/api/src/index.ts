import type { RequestHandler } from "express";

// const app = require("./app.js");
// const { connectDB } = require("./utils/db.utils.js");
// const { setServerStartTime } = require("./utils/server.utils.js");

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

const handler: RequestHandler = async (req, res) => {
  await initializeDB();
  app(req, res);
};

export default handler;
