import type { DBUser } from "../models/users.models.js";
import type { SignOptions, VerifyOptions } from "jsonwebtoken";

import jwt from "jsonwebtoken";

function getTokenKey() {
  const tokenKey = process.env.TOKEN_KEY;

  if (!tokenKey) {
    throw new Error(
      "TOKEN_KEY environment variable is not set. Required to sign and verify JWTs.",
    );
  }

  return tokenKey;
}

function createToken(user: DBUser) {
  const payload = {
    userId: user.userId,
    role: user.role,
    username: user.account.username,
    email: user.account.email,
    accessTokenVersion: user.auth.accessTokenVersion,
  };
  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn: "1h",
    issuer: "runners-api",
  };

  const token = jwt.sign(payload, getTokenKey(), options);
  return token;
}

function verifyToken(token: string) {
  const options: VerifyOptions = {
    algorithms: ["HS256"],
    issuer: "runners-api",
  };
  const decoded = jwt.verify(token, getTokenKey(), options);
  return decoded;
}

export { createToken, verifyToken };
