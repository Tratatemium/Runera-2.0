import type { Response, CookieOptions } from "express";

interface CookieData {
  name: string;
  value: string;
  options?: CookieOptions & Record<string, unknown>;
}

interface SuccessOptions {
  statusCode?: number;
  data?: Record<string, unknown> | null;
  cookie?: CookieData;
  extra?: Record<string, unknown>;
}

function sendSuccess(
  res: Response,
  { statusCode = 200, data = null, cookie, extra = {} }: SuccessOptions = {},
) {
  res.status(statusCode);

  if (cookie) {
    const isDev = process.env.NODE_ENV === "development";
    res.cookie(cookie.name, cookie.value, {
      httpOnly: true,
      secure: !isDev,
      sameSite: isDev ? "lax" : "none",
      partitioned: isDev ? undefined : true,
      maxAge: 1000 * 60 * 60,
      ...cookie.options,
    });
  }

  res.json({
    status: "success",
    ...extra,
    data,
  });
}

function sendError(
  res: Response,
  err: Error,
  extra: Record<string, unknown> = {},
) {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  const name = err.errorName || err.name || "Error";

  interface ErrorResponse {
    message: string;
    name: string;
    field?: string;
    [key: string]: unknown;
  }

  const errorResponse: ErrorResponse = { message, name, ...extra };

  if (err.field) {
    errorResponse.field = err.field;
  }
  res.status(status).json({ error: errorResponse });
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export { sendSuccess, sendError, capitalize };
