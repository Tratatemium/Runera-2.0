import type { Request, Response, NextFunction } from "express";

import * as validators from "./validators.js";

function validateUUID(param = "id") {
  return (req: Request, res: Response, next: NextFunction) => {
    const value = req.params[param];
    validators.validateUUID(Array.isArray(value) ? value[0] : value);
    next();
  };
}

const profileFields = [
  {
    key: "firstName",
    input: null,
    validate: (input: unknown) => validators.validateName(input, "firstName"),
  },
  {
    key: "lastName",
    input: null,
    validate: (input: unknown) => validators.validateName(input, "lastName"),
  },
  {
    key: "dateOfBirth",
    input: null,
    validate: (input: unknown) =>
      validators.validateISO(input, "dateOfBirth", "date"),
  },
  {
    key: "heightCm",
    input: null,
    validate: (input: unknown) =>
      validators.validatePositiveNumber(input, "heightCm"),
  },
  {
    key: "weightKg",
    input: null,
    validate: (input: unknown) =>
      validators.validatePositiveNumber(input, "weightKg"),
  },
];

function validateProfileUpdate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  validators.validateJsonContentType(req);
  const profile = req.body.profile;

  const fieldKeys = profileFields.map((f) => f.key);
  validators.assertRequestFields({
    object: profile,
    objectName: "profile",
    requiredFields: fieldKeys,
    allowedFields: fieldKeys,
    mode: "require_some",
  });

  const boundProfileFields = profileFields.map((field) => ({
    ...field,
    input: profile[field.key],
  }));

  boundProfileFields
    .filter((field) => field.input != null)
    .forEach((field) => field.validate(field.input));

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
      key: "password",
      value: newPassword,
      validate: validators.validatePassword,
    },
    { key: "email", value: newEmail, validate: validators.validateEmail },
    {
      key: "username",
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

export { validateUUID, validateProfileUpdate, validateAccountUpdate };
