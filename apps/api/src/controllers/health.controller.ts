import type { Request, Response } from "express";

import { checkDBConnection } from "../utils/db.utils.js";
import { getUptime } from "../utils/server.utils.js";

function healthController(req: Request, res: Response) {
  res.status(200).json({
    status: "running",
    uptime: getUptime(),
    version: "1.0.0",
    DBConnection: checkDBConnection(),
  });
}

export { healthController };
