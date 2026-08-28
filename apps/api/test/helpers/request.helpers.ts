import type { Response } from "supertest";
import type { Test } from "supertest";
import { expect } from "@jest/globals";

interface AuthValidationTest {
  name: string;
  setupAuth: (req: Test) => Test;
}

interface ContentTypeTest {
  name: string;
  contentType: string;
  body: string;
}

interface MissingFieldTest {
  name: string;
  data: Record<string, unknown>;
  field: string;
}

function expectErrorResponse(response: Response, expectedStatus: number): void {
  expect(response.statusCode).toBe(expectedStatus);
  expect(response.headers["content-type"]).toMatch(/json/);
  expect(response.body).toHaveProperty("error");
  expect(response.body.error).toEqual(
    expect.objectContaining({
      name: expect.any(String),
      message: expect.any(String),
    }),
  );
}

/**
 * Test cases for authentication validation (401 errors)
 * Returns an array of test case objects
 */
const getAuthValidationTests = (): AuthValidationTest[] => [
  {
    name: "returns 401 when no auth cookie is provided",
    setupAuth: (req) => req,
  },
  {
    name: "returns 401 when cookie is malformed",
    setupAuth: (req) => req.set("Cookie", "token"),
  },
  {
    name: "returns 401 for invalid token",
    setupAuth: (req) => req.set("Cookie", "token=invalid.token.here"),
  },
];

/**
 * Test cases for Content-Type validation (415 errors)
 */
const getContentTypeTests = (): ContentTypeTest[] => [
  {
    name: "returns 415 when Content-Type is not JSON",
    contentType: "text/plain",
    body: "not json",
  },
];

/**
 * Generate test cases for missing required fields
 */
const getMissingFieldTests = (
  validData: Record<string, unknown>,
  requiredFields: string[],
): MissingFieldTest[] => {
  return requiredFields.map((field) => {
    const { [field]: omitted, ...dataWithoutField } = validData;
    return {
      name: `returns 400 for missing ${field} field`,
      data: dataWithoutField,
      field,
    };
  });
};

export {
  expectErrorResponse,
  getAuthValidationTests,
  getContentTypeTests,
  getMissingFieldTests,
};
