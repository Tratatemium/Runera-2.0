import type { RunRequest } from "@runera/shared";
import type { TokenPayload } from "../utils/jwt.utils.ts";

declare global {
  interface Error {
    status?: number;
    errorName?: string;
    field?: string;
  }
  namespace Express {
    interface Request {
      user: TokenPayload;
      runData: RunRequest;
      fieldToUpdate: "username" | "email" | "password";
    }
  }
}
