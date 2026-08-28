import type { SetStateAction } from "react";
import { ApiResponse } from "../types/api.types";
import { ApiError, ResponseError } from "../errors/errors";

function joinUrl(urlPart1: string, urlPart2: string) {
  return `${urlPart1.replace(/\/+$/, "")}/${urlPart2.replace(/^\/+/, "")}`;
}

function jsonOptions<T>(method: RequestInit["method"], data?: T): RequestInit {
  return {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    ...(data && { body: JSON.stringify(data) }),
  };
}

async function getResponseData(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function handleServerErrors(
  response: Response,
  data: ApiResponse | undefined,
  suppressUnauthorized: boolean = false,
) {
  if (!data) throw new ResponseError("Empty Error from server.");
  if (!data.error) throw new ResponseError("Malformed Error from server.");

  const status = response.status;
  const message = data.error.message ?? "Unknown server error.";
  const code = data.error.name;
  const field = data.error.field;

  const isLoginError = code === "LoginError";
  if (status === 401 && !isLoginError && !suppressUnauthorized) {
    window.dispatchEvent(new Event("unauthorized"));
  }

  throw new ApiError(message, status, code, field);
}

function handleApiFormError(
  err: unknown,
  setFormError: (value: SetStateAction<string | undefined>) => void,
) {
  if (err instanceof ApiError) {
    console.error(err.code, err.message);

    if (err.field) return { [err.field]: err.message };
    else setFormError(err.message);
  } else {
    console.error("Unexpected error", err);
    setFormError("Something went wrong.");
  }
}

export {
  joinUrl,
  jsonOptions,
  getResponseData,
  handleServerErrors,
  handleApiFormError,
};
