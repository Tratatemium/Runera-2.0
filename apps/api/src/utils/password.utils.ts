import type { DBUser } from "../models/users.models.js";

import bcrypt from "bcrypt";
import { LoginError } from "../errors/errors.js";

const saltRounds = 10;
const algorithm = "bcrypt";
const DUMMY_HASH =
  "$2b$10$CwTycUXWue0Thq9StjUM0uJ8pJ6D0sJ1uQe8kJZ9nY9E6kKq6Zq9W";

async function createPasswordHash(plainTextPassword: string) {
  const passwordHash = await bcrypt.hash(plainTextPassword, saltRounds);
  const passwordMetadata = {
    algorithm,
    updatedAt: new Date().toISOString(),
    failedLoginAttempts: 0,
    lockUntil: null,
  };
  return { passwordHash, passwordMetadata };
}

async function comparePasswordHash(foundUser: DBUser | null, password: string) {
  const passwordHash = foundUser
    ? foundUser.credentials.passwordHash
    : DUMMY_HASH;
  const isPasswordCorrect = await bcrypt.compare(password, passwordHash);

  if (!foundUser || !isPasswordCorrect) throw new LoginError();
}

export { createPasswordHash, comparePasswordHash };
