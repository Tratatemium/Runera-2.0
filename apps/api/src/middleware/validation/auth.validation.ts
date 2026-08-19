import type { Request, Response, NextFunction } from "express";

import * as validators from "./validators.js";

function validateRegisterRequest(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  validators.validateJsonContentType(req);

  validators.assertRequestFields({
    object: req.body,
    objectName: "User data",
    requiredFields: ["username", "password", "email"],
    mode: "require_all",
  });

  const { username, password, email } = req.body;

  validators.validateUsername(username);
  validators.validateEmail(email);
  validators.validatePassword(password);

  next();
}

function validateLoginRequest(req: Request, res: Response, next: NextFunction) {
  validators.validateJsonContentType(req);

  if (req.body.password == null) {
    validators.throwValidationError({
      message: "Login request must include password.",
      field: "password",
    });
  }
  validators.assertRequestFields({
    object: req.body,
    objectName: "Login request",
    requiredFields: ["username", "email"],
    allowedFields: ["username", "email", "password"],
    mode: "require_some",
  });

  const { username, password, email } = req.body;

  if (email && username)
    validators.throwValidationError({
      message: "Provide either email or username, but not both.",
      field: "identifier",
    });

  if (username != null) validators.validateUsername(username);
  if (email != null) validators.validateEmail(email);
  validators.validatePassword(password);

  next();
}

export { validateRegisterRequest, validateLoginRequest };
