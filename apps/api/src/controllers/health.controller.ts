import type { Request, Response } from "express";

import { checkDBConnection } from "../utils/db.utils.js";
import { getUptime } from "../utils/server.utils.js";

async function healthController(req: Request, res: Response) {
  const DBConnection = await checkDBConnection();
  res.status(200).json({
    status: "running",
    uptime: getUptime(),
    version: "1.0.0",
    DBConnection,
  });
}

export { healthController };
