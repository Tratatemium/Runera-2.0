import type { Request, Response, NextFunction } from "express";

import {
  MongoServerError,
  MongoNetworkError,
  MongoServerSelectionError,
} from "mongodb";
import jwt from "jsonwebtoken";
const { JsonWebTokenError, TokenExpiredError, NotBeforeError } = jwt;

import { sendError, capitalize } from "../utils/response.utils.js";

function apiErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // --- JSON parse errors ---
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    err.status = 400;
    err.name = "InvalidJsonError";
    err.message = "Invalid JSON payload.";
  }

  // --- MongoDB connection errors ---
  const isConnectionError =
    err instanceof MongoServerSelectionError ||
    err instanceof MongoNetworkError;

  if (isConnectionError) {
    err.status = 500;
    err.errorName = "DatabaseError";
    err.message = "Failed to connect to database.";
  }

  // --- Duplicate key errors ---
  const isDuplicateKey = err instanceof MongoServerError && err.code === 11000;

  if (isDuplicateKey) {
    const rawField = Object.keys(err.keyValue || {})[0];
    const value = rawField ? err.keyValue[rawField] : undefined;
    const field = rawField?.slice(rawField.lastIndexOf(".") + 1);
    err.status = 409;
    err.errorName = "DuplicateKeyError";
    err.field = field;
    err.message = field
      ? capitalize(`${field} ${value} already exists.`)
      : "Data already exists";
  }

  // --- JWT errors ---
  if (
    err instanceof JsonWebTokenError ||
    err instanceof TokenExpiredError ||
    err instanceof NotBeforeError
  ) {
    err.status = 401;

    if (err instanceof TokenExpiredError) err.message = "Token expired.";
    else if (err instanceof NotBeforeError)
      err.message = "Token not active yet.";
    else if (err instanceof JsonWebTokenError) err.message = "Invalid token.";

    err.errorName = "AuthError";
  }

  // --- Log server errors ---
  const status = err.status || 500;
  if (status >= 500) console.error(err);

  // --- Send error response ---
  sendError(res, err);
}

export { apiErrorHandler };
