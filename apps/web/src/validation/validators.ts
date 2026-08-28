import type { FormStateValue } from "../types/forms.types";

import {
  checkEmpty,
  checkLength,
  checkWhitespace,
  checkNumberGreaterThanZero,
} from "./validationUtils";

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX =
  /^[A-Za-z\u00C0-\u024F\u0400-\u04FF]+([ '-][A-Za-z\u00C0-\u024F\u0400-\u04FF]+)*$/;

function validateUsername(value: string, _formState: FormStateValue) {
  return (
    checkEmpty(value, "Username") ??
    (/^[0-9]/.test(value)
      ? "Username can not start with a number."
      : undefined) ??
    checkLength(value, "Username", 4, 20) ??
    (!USERNAME_REGEX.test(value)
      ? "Username can only contain letters, numbers, and underscores."
      : undefined)
  );
}

function validateEmail(value: string, _formState: FormStateValue) {
  return (
    checkEmpty(value, "Email") ??
    checkLength(value, "Email", null, 254) ??
    checkWhitespace(value, "Email") ??
    (!EMAIL_REGEX.test(value)
      ? "Please enter a valid email address."
      : undefined)
  );
}

function validatePassword(value: string, _formState: FormStateValue) {
  return (
    checkEmpty(value, "Password") ??
    checkLength(value, "Password", 8, 128) ??
    checkWhitespace(value, "Password")
  );
}

function validateConfirmPassword(value: string, formState: FormStateValue) {
  if (formState.password.value !== value) {
    return "Passwords do not match.";
  }
}

function validateLogin(value: string, _formState: FormStateValue) {
  return (
    checkEmpty(value, "Login") ??
    checkLength(value, "Login", 4, 254) ??
    checkWhitespace(value, "Login")
  );
}

function validateName(value: string, _formState: FormStateValue) {
  if (!value) return undefined;
  return (
    checkLength(value, "Name", 2, 50) ??
    (!NAME_REGEX.test(value) ? "Use letters, spaces, ' and - only." : undefined)
  );
}

function validateDistance(value: string, _formState: FormStateValue) {
  return (
    checkEmpty(value, "Distance") ??
    checkNumberGreaterThanZero(value, "Distance")
  );
}

function validateStartTime(value: string, _formState: FormStateValue) {
  return checkEmpty(value, "Start time");
}

function validateDuration(_value: string, formState: FormStateValue) {
  const isDurationEmpty = ["durationH", "durationM", "durationS"].every(
    (fieldName) => !formState[fieldName]?.value,
  );

  if (isDurationEmpty) {
    return "Add duration in at least one field.";
  }
}

export {
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateLogin,
  validateName,
  validateDistance,
  validateStartTime,
  validateDuration,
};
