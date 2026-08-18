import app from "./app.js";
import { setServerStartTime } from "./utils/server.utils.js";
import { connectDB } from "./utils/db.utils.js";

setServerStartTime();

let PORT: string;
try {
  ({ PORT } = require("./config/env.config"));
} catch (err) {
  console.error(
    "Configuration error:",
    err instanceof Error ? err.message : "unknown error",
  );
  process.exit(1);
}

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`API server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
}

startServer();
