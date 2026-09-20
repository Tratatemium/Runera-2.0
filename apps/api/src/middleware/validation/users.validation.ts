import type { Request, Response, NextFunction } from "express";
import type { FieldConfig } from "./validators.js";

import * as validators from "./validators.js";

function validateUUID(param = "id") {
  return (req: Request, res: Response, next: NextFunction) => {
    const value = req.params[param];
    validators.validateUUID(Array.isArray(value) ? value[0] : value);
    next();
  };
}

const profileFields: FieldConfig = [
  {
    key: "firstName",
    validate: (input: unknown) => validators.validateName(input, "firstName"),
  },
  {
    key: "lastName",
    validate: (input: unknown) => validators.validateName(input, "lastName"),
  },
  {
    key: "dateOfBirth",
    validate: (input: unknown) =>
      validators.validateISO(input, "dateOfBirth", "date"),
  },
  {
    key: "heightCm",
    validate: (input: unknown) =>
      validators.validatePositiveNumber(input, "heightCm"),
  },
  {
    key: "weightKg",
    validate: (input: unknown) =>
      validators.validatePositiveNumber(input, "weightKg"),
  },
  {
    key: "gender",
    validate: (input: unknown) =>
      validators.validateEnumField({ value: input, type: "gender" }),
  },
  {
    key: "runningExperience",
    validate: (input: unknown) =>
      validators.validateEnumField({ value: input, type: "runningExperience" }),
  },
];

function validateProfileUpdate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  validators.validateJsonContentType(req);
  const profile = req.body.profile;
  validators.validateObject({
    object: profile,
    objectName: "profile",
    fieldConfig: profileFields,
    mode: "require_some",
  });
  next();
}

const runningProfileFields: FieldConfig = [
  {
    key: "runningPreferences",
    fields: [
      {
        key: "constraints",
        fields: [
          {
            key: "availableDays",
            validate: (input: unknown) =>
              validators.validateEnumArray({
                value: input,
                type: "runningPreferences.constraints.availableDays",
              }),
          },
          {
            key: "maxRunMinutes",
            validate: (input: unknown) =>
              validators.validatePositiveNumber(
                input,
                "runningPreferences.constraints.maxRunMinutes",
              ),
          },
        ],
      },
      {
        key: "preferences",
        fields: [
          {
            key: "runsPerWeek",
            validate: (input: unknown) =>
              validators.validateRunsPerWeek(
                input,
                "runningPreferences.preferences.runsPerWeek",
              ),
          },

          {
            key: "longRunDay",
            validate: (input: unknown) =>
              validators.validateEnumField({
                value: input,
                type: "runningPreferences.preferences.longRunDay",
              }),
          },
          {
            key: "runTypes",
            validate: (input: unknown) =>
              validators.validateEnumArray({
                value: input,
                type: "runningPreferences.preferences.runTypes",
              }),
          },
        ],
      },
      {
        key: "notes",
        validate: (input: unknown) =>
          validators.assertString(input, "runningPreferences.notes"),
      },
    ],
  },
  {
    key: "health",
    fields: [
      {
        key: "items",
        validate: (input: unknown) =>
          validators.validateEnumArray({ value: input, type: "health.items" }),
      },
      {
        key: "notes",
        validate: (input: unknown) =>
          validators.assertString(input, "health.notes"),
      },
    ],
  },
];

function validateRunningProfileUpdate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  validators.validateJsonContentType(req);
  const runningProfile = req.body;
  validators.validateObject({
    object: runningProfile,
    objectName: "runningProfile",
    fieldConfig: runningProfileFields,
    mode: "require_some",
  });
  next();
}

function validateAccountUpdate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  validators.validateJsonContentType(req);

  const { currentPassword, newPassword, newEmail, newUsername } = req.body;

  if (currentPassword == null) {
    validators.throwValidationError({
      message: "currentPassword must be provided.",
      field: "currentPassword",
    });
  }
  validators.validatePassword(currentPassword);

  const updateFields = [
    {
      key: "password" as const,
      value: newPassword,
      validate: validators.validatePassword,
    },
    {
      key: "email" as const,
      value: newEmail,
      validate: validators.validateEmail,
    },
    {
      key: "username" as const,
      value: newUsername,
      validate: validators.validateUsername,
    },
  ];

  const provided = updateFields.filter((field) => field.value != null);

  if (provided.length !== 1) {
    validators.throwValidationError({
      message:
        "Request body must include currentPassword and only one of: newPassword, newEmail, newUsername.",
    });
  }

  const fieldToUpdate = provided[0];
  fieldToUpdate.validate(fieldToUpdate.value);
  req.fieldToUpdate = fieldToUpdate.key;

  next();
}

/* ================================================================================================= */
/*  EXPORTS                                                                                          */
/* ================================================================================================= */

export {
  validateUUID,
  validateProfileUpdate,
  validateRunningProfileUpdate,
  validateAccountUpdate,
};
