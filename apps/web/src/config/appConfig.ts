const BASE_URL = process.env.REACT_APP_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("Missing REACT_APP_API_BASE_URL");
}

export const config = {
  BASE_URL,
};
