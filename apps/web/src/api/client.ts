import type { ApiResponse } from "../types/api.types";

import { config } from "../config/appConfig";
import {
  joinUrl,
  getResponseData,
  handleServerErrors,
} from "../utils/api.utils";
import { ResponseError } from "../errors/errors";

interface ApiRequestOptions {
  path: string;
  assertData: boolean;
  suppressUnauthorized?: boolean;
  options: RequestInit;
}

async function apiRequest<T>(
  config: ApiRequestOptions & { assertData: true },
): Promise<T>;

async function apiRequest<T>(
  config: ApiRequestOptions & { assertData: false },
): Promise<T | null>;

async function apiRequest<T>({
  path,
  assertData,
  suppressUnauthorized,
  options,
}: ApiRequestOptions & {
  assertData?: boolean;
  suppressUnauthorized?: boolean;
}): Promise<T | null> {
  const response = await fetch(joinUrl(config.BASE_URL, path), {
    credentials: "include",
    ...options,
  });
  const data = (await getResponseData(response)) as ApiResponse | undefined;
  if (!response.ok) handleServerErrors(response, data, suppressUnauthorized);

  if (assertData && !data)
    throw new ResponseError("Empty response from server.");

  if (!data) return null;

  return (data as { data: T }).data;
}

export { apiRequest };
