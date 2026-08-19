import type { Request } from "express";

import { ValidationError } from "../../errors/errors.js";

/* ================================================================================================= */
/*  HELPER FUNCTIONS                                                                                 */
/* ================================================================================================= */

interface ValidationErrorType {
  message: string;
  status?: number;
  field?: string;
}

function throwValidationError({
  message,
  field = undefined,
  status = 400,
}: ValidationErrorType) {
  throw new ValidationError(message, status, field ?? "");
}

/* ================================================================================================= */
/*  VALIDATE FUNCTIONS                                                                               */
/* ================================================================================================= */

function validateJsonContentType(req: Request) {
  if (!req.is("json")) {
    throwValidationError({
      message: "Content-Type must be json.",
      status: 415,
    });
  }
}

interface assertRequestFieldsType {
  object: Record<string, unknown>;
  objectName?: string;
  requiredFields?: string[];
  allowedFields?: string[];
  mode?: "require_all" | "require_some";
}

function assertRequestFields({
  object,
  objectName = "Request body",
  requiredFields,
  allowedFields,
  mode = "require_all",
}: assertRequestFieldsType) {
  if (!["require_all", "require_some"].includes(mode)) {
    throw new Error(`Invalid validation mode: ${mode}.`);
  }
  if (!Array.isArray(requiredFields) || requiredFields.length === 0) {
    throw new Error("requiredFields must be a non-empty array.");
  }
  if (
    allowedFields != null &&
    (!Array.isArray(allowedFields) || allowedFields.length === 0)
  ) {
    throw new Error("allowedFields must be a non-empty array.");
  }
  if (typeof object !== "object" || object == null || Array.isArray(object)) {
    throwValidationError({
      message: `${objectName} must be provided as an object.`,
    });
  }

  if (allowedFields != null) {
    for (const key of Object.keys(object)) {
      if (!allowedFields.includes(key)) {
        throwValidationError({ message: `Unknown field: ${key}` });
      }
    }
  }

  const hasValue = (field: string) => object[field] != null;

  if (mode === "require_all") {
    const missingFields = requiredFields.filter((field) => !hasValue(field));
    if (missingFields.length > 0) {
      throwValidationError({
        message: `${objectName} is missing required fields: ${missingFields.join(", ")}.`,
      });
    }
    return;
  }

  if (mode === "require_some") {
    const hasAtLeastOneField = requiredFields.some((field) => hasValue(field));
    if (!hasAtLeastOneField) {
      throwValidationError({
        message: `${objectName} must have one of the required fields: ${requiredFields.join(", ")}.`,
      });
    }
    return;
  }
}

function assertString(
  value: unknown,
  fieldName: string,
): asserts value is string {
  if (typeof value !== "string") {
    throwValidationError({
      message: `${fieldName} must be a string.`,
      field: fieldName,
    });
  }
}

function validateUUID(ID: string, IDname = "ID") {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const isUUID = uuidRegex.test(ID);
  if (!isUUID) {
    throwValidationError({
      message: `${IDname} must be a valid UUID.`,
      field: IDname,
    });
  }
}

function validateISO(value: unknown, fieldName: string, mode = "datetime") {
  assertString(value, fieldName);

  // -------------------
  // DATE-ONLY MODE
  // -------------------
  if (mode === "date") {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) {
      throwValidationError({
        message: `${name} must be a valid ISO 8601 date (YYYY-MM-DD).`,
        field: fieldName,
      });
    }

    const date = new Date(`${value}T00:00:00Z`);
    if (!Number.isFinite(date.getTime())) {
      throwValidationError({
        message: `${fieldName} must be a valid calendar date.`,
        field: fieldName,
      });
    }

    if (date.toISOString().slice(0, 10) !== value) {
      throwValidationError({
        message: `${fieldName} must be a real calendar date.`,
        field: fieldName,
      });
    }

    return;
  }

  // -------------------
  // DATETIME MODE
  // -------------------
  if (mode === "datetime") {
    const datetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
    if (!datetimeRegex.test(value)) {
      throwValidationError({
        message: `${fieldName} must be a valid ISO 8601 timestamp with timezone (UTC).`,
        field: fieldName,
      });
    }

    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) {
      throwValidationError({
        message: `${fieldName} must be a valid ISO 8601 timestamp.`,
        field: fieldName,
      });
    }

    const [datePart, timePart] = value.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute, second] = timePart
      .replace("Z", "")
      .split(":")
      .map(Number);
    const secondWhole = Math.floor(second);

    const isValid =
      date.getUTCFullYear() === year &&
      date.getUTCMonth() + 1 === month &&
      date.getUTCDate() === day &&
      date.getUTCHours() === hour &&
      date.getUTCMinutes() === minute &&
      date.getUTCSeconds() === secondWhole;

    if (!isValid) {
      throwValidationError({
        message: `${fieldName} must be a real calendar date and time.`,
        field: fieldName,
      });
    }

    return;
  }

  // -------------------
  // INVALID MODE
  // -------------------
  throw new Error(
    `Invalid mode "${mode}" in validateISO. Must be "date" or "datetime".`,
  );
}

function validatePositiveNumber(value: unknown, fieldName: string) {
  if (typeof value !== "number" || !isFinite(value) || value <= 0) {
    throwValidationError({
      message: `${fieldName} must be a positive number.`,
      field: fieldName,
    });
  }
}

function validateUsername(username: unknown) {
  assertString(username, "username");

  if (username.length < 4 || username.length > 20) {
    throwValidationError({
      message: "Username must be between 4 and 20 characters long.",
      field: "username",
    });
  }
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    throwValidationError({
      message: "Username may only contain letters, numbers, and underscores.",
      field: "username",
    });
  }
}

function validateEmail(email: unknown) {
  assertString(email, "email");

  if (email.length > 254) {
    throwValidationError({
      message: "Email must not be longer than 254 characters.",
      field: "email",
    });
  }
  if (/\s/.test(email)) {
    throwValidationError({
      message: "Email must not contain whitespace.",
      field: "email",
    });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throwValidationError({
      message: "Email must be a valid email address.",
      field: "email",
    });
  }
}

function validatePassword(password: unknown) {
  assertString(password, "password");

  const length = password.length;
  if (length < 8) {
    throwValidationError({
      message: "Password must be at least 8 characters long.",
      field: "password",
    });
  }
  if (length > 128) {
    throwValidationError({
      message: "Password must be at most 128 characters long.",
      field: "password",
    });
  }
}

function validateName(name: unknown, fieldName: string) {
  assertString(name, fieldName);

  const trimmed = name.trim();
  if (trimmed.length === 0) {
    throwValidationError({
      message: `${fieldName} cannot be empty.`,
      field: fieldName,
    });
  }
  if (trimmed.length < 2 || trimmed.length > 50) {
    throwValidationError({
      message: `${fieldName} must contain between 2 and 50 characters.`,
      field: fieldName,
    });
  }

  const nameRegex = /^\p{L}+([ '-]\p{L}+)*$/u;
  if (!nameRegex.test(trimmed)) {
    throwValidationError({
      message: `${fieldName} contains forbidden characters.`,
      field: fieldName,
    });
  }
}

function validatePerceivedEffort(perceivedEffort: unknown) {
  if (typeof perceivedEffort !== "number") {
    throwValidationError({
      message: "perceivedEffort must be a number.",
      field: "perceivedEffort",
    });
    return;
  }
  if (perceivedEffort < 1 || perceivedEffort > 10) {
    throwValidationError({
      message: "PerceivedEffort must be between 1 and 10",
      field: "perceivedEffort",
    });
  }
}

function validateWeather(weather: unknown) {
  assertString(weather, "weather");

  const weatherEnum = [
    "sunny",
    "partly_cloudy",
    "cloudy",
    "rain",
    "snow",
    "windy",
    "hot",
    "cold",
  ];
  if (!weatherEnum.includes(weather)) {
    throwValidationError({
      message: `Weather must be one of ["sunny", "partly_cloudy", "cloudy", "rain", "snow", "windy", "hot", "cold"]. Received: ${weather}.`,
      field: "weather",
    });
  }
}

/* ================================================================================================= */
/*  EXPORTS                                                                                          */
/* ================================================================================================= */

export {
  throwValidationError,
  validateJsonContentType,
  assertRequestFields,
  assertString,
  validateUUID,
  validateISO,
  validatePositiveNumber,
  validateUsername,
  validateEmail,
  validatePassword,
  validateName,
  validatePerceivedEffort,
  validateWeather,
};
