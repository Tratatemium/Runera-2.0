import type { Request, Response, NextFunction } from "express";
import type { RunRequest } from "@runera/shared";

import * as validators from "./validators.js";

function validateUUID(param = "id") {
  return (req: Request, res: Response, next: NextFunction) => {
    const value = req.params[param];
    validators.validateUUID(Array.isArray(value) ? value[0] : value);
    next();
  };
}

const runFields = [
  {
    key: "startTime",
    input: null,
    validate: (input: unknown) => {
      validators.assertString(input, "startTime");
      const trimmed = input.trim();
      validators.validateISO(trimmed, "startTime", "datetime");
      return trimmed;
    },
  },
  {
    key: "durationSec",
    input: null,
    validate: (input: unknown) => {
      const normalized = Number(String(input).trim());
      validators.validatePositiveNumber(normalized, "durationSec");
      return normalized;
    },
  },
  {
    key: "distanceMeters",
    input: null,
    validate: (input: unknown) => {
      const normalized = Number(String(input).trim());
      validators.validatePositiveNumber(normalized, "distanceMeters");
      return normalized;
    },
  },
  {
    key: "title",
    input: null,
    validate: (input: unknown) => {
      validators.assertString(input, "title");
      return input;
    },
  },
  {
    key: "notes",
    input: null,
    validate: (input: unknown) => {
      validators.assertString(input, "notes");
      return input;
    },
  },
  {
    key: "perceivedEffort",
    input: null,
    validate: (input: unknown) => {
      const normalized = Number(String(input).trim());
      validators.validatePositiveNumber(normalized, "perceivedEffort");
      validators.validatePerceivedEffort(normalized);
      return normalized;
    },
  },
  {
    key: "weather",
    input: null,
    validate: (input: unknown) => {
      validators.assertString(input, "weather");
      validators.validateWeather(input);
      return input;
    },
  },
];

function validateRun({
  mode = "require_some",
}: {
  mode?: "require_all" | "require_some";
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    validators.validateJsonContentType(req);

    validators.assertRequestFields({
      object: req.body,
      objectName: "Run data",
      requiredFields: ["startTime", "durationSec", "distanceMeters"],
      allowedFields: [
        "startTime",
        "durationSec",
        "distanceMeters",
        "title",
        "notes",
        "perceivedEffort",
        "weather",
      ],
      mode: mode,
    });

    const boundRunFields = runFields.map((field) => ({
      ...field,
      input: req.body[field.key],
    }));

    const runData = Object.fromEntries(
      boundRunFields
        .filter((field) => field.input != null)
        .map((field) => [field.key, field.validate(field.input)]),
    ) as unknown as RunRequest;

    req.runData = runData;
    next();
  };
}

export { validateUUID, validateRun };
