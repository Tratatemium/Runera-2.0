import type { LoginRequest, SignupRequest } from "@runera/shared";
import type { Test } from "supertest";

import request from "supertest";
import app from "../../src/app.js";

async function getAuthToken(credentials: LoginRequest): Promise<string> {
  const loginRes = await request(app)
    .post("/api/v1/auth/login")
    .send(credentials);

  if (loginRes.statusCode !== 200) {
    throw new Error(
      `Login failed with status ${loginRes.statusCode}: ${JSON.stringify(loginRes.body)}`,
    );
  }

  const setCookie = loginRes.headers["set-cookie"];
  if (!Array.isArray(setCookie) || setCookie.length === 0) {
    throw new Error(
      `Login response is missing set-cookie header: ${JSON.stringify(loginRes.headers)}`,
    );
  }

  return setCookie[0].split(";")[0];
}

async function createUser(
  userData: SignupRequest,
): Promise<{ userId: string }> {
  const response = await request(app)
    .post("/api/v1/auth/signup")
    .send(userData);

  if (response.statusCode !== 201) {
    throw new Error(
      `User creation failed with status ${response.statusCode}: ${JSON.stringify(response.body)}`,
    );
  }

  return response.body;
}

async function createUserAndGetToken(
  userData: SignupRequest,
): Promise<{ user: { userId: string }; token: string }> {
  const user = await createUser(userData);
  const token = await getAuthToken({
    email: userData.email,
    password: userData.password,
  });

  return { user, token };
}

/**
 * Make authenticated request with auth cookie
 * @param {Function} requestFn - Supertest request function
 * @param {string} token - Cookie header value from getAuthToken (token=...)
 * @returns {Object} Supertest request object with Cookie header set
 */
function authenticatedRequest(requestFn: Test, token: string): Test {
  return requestFn.set("Cookie", token);
}

export {
  getAuthToken,
  createUser,
  createUserAndGetToken,
  authenticatedRequest,
};
