/* ================================================================================================= */
/*  IMPORTS                                                                                          */
/* ================================================================================================= */

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

/* ================================================================================================= */
/*  MIDDLEWARE                                                                                       */
/* ================================================================================================= */

app.use(express.json());

app.use(cookieParser());

const allowedOrigins = ["http://localhost:3000", "https://runera.vercel.app"];
const allowedVercelHostPattern = /^runera(?:-[a-z0-9-]+)?\.vercel\.app$/i;

function checkAllowedVercelOrigin(origin: string) {
  try {
    const { protocol, hostname } = new URL(origin);
    return protocol === "https:" && allowedVercelHostPattern.test(hostname);
  } catch {
    return false;
  }
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        checkAllowedVercelOrigin(origin)
      ) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  }),
);

/* ================================================================================================= */
/*  VERCEL                                                                                     */
/* ================================================================================================= */

app.get("/", (req, res) => {
  res.status(200).json({
    service: "runners-api",
    status: "running",
  });
});

app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

/* ================================================================================================= */
/*  ROUTER IMPORTS                                                                                   */
/* ================================================================================================= */

import healthRouter from "./routers/health.router.js";
import authRouter from "./routers/auth.router.js";
import usersRouter from "./routers/users.router.js";
import runsRouter from "./routers/runs.router.js";

/* ================================================================================================= */
/*  API ROUTERS (VERSIONED)                                                                          */
/* ================================================================================================= */

const v1Router = express.Router();

v1Router.use("/auth", authRouter);
v1Router.use("/users", usersRouter);
v1Router.use("/runs", runsRouter);

app.use("/health", healthRouter);
app.use("/api/v1", v1Router);

/* ================================================================================================= */
/*  ERROR HANDLERS                                                                                   */
/* ================================================================================================= */

import { apiErrorHandler } from "./middleware/error.middleware.js";

app.use(apiErrorHandler);

/* ================================================================================================= */
/*  EXPORTS                                                                                          */
/* ================================================================================================= */

export default app;
