import { setServerStartTime } from "./utils/server.utils.ts'";

setServerStartTime();

let PORT;
try {
  ({ PORT } = require("./config/env.config"));
} catch (err) {
  console.error("Configuration error:", err.message);
  process.exit(1);
}

import app from "./app.js";
import { connectDB } from "./utils/db.utils.js";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`API server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
};

startServer();
