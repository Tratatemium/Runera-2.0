import { RunRequest } from "@runera/shared";

declare global {
  namespace Express {
    interface Request {
      runData: RunRequest;
    }
  }
}
