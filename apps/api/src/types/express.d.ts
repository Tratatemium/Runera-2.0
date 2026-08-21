import { RunRequest } from "@runera/shared";

declare global {
  namespace Express {
    interface Request {
      user: TokenPayload;
      runData: RunRequest;
      fieldToUpdate: string;
    }
  }
}
