import request from "supertest";
import { describe, it, expect } from "@jest/globals";
import app from "../../../src/app.js";
import { VALID_USER_DATA } from "../../helpers/test-data";
import {
  expect400WithMessage,
  expect409Error,
  expect415Error,
  expectJsonResponse,
} from "../../helpers/assertions";

describe("POST /api/v1/auth/signup", function () {
  describe("Content-Type validation", function () {
    it("returns 415 when Content-Type is not JSON", async function () {
      const res = await request(app)
        .post("/api/v1/auth/signup")
        .set("Content-Type", "text/plain")
        .send("not json");

      expect415Error(res);
    });
  });
});

describe("Required fields validation", function () {
  it("returns 400 for empty JSON", async function () {
    const res = await request(app).post("/api/v1/auth/signup").send({});

    expect400WithMessage(
      res,
      "User data is missing required fields: username, password, email.",
    );
  });

  it.each(["username", "password", "email"])(
    "returns 400 for missing %s field",
    async (field) => {
      const { [field]: omitted, ...dataWithoutField } =
        VALID_USER_DATA as Record<string, unknown>;
      const res = await request(app)
        .post("/api/v1/auth/signup")
        .send(dataWithoutField);

      expect400WithMessage(
        res,
        `User data is missing required fields: ${field}.`,
      );
    },
  );

  it("returns 400 when field is null", async function () {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({ ...VALID_USER_DATA, username: null });

    expect400WithMessage(res, /username/);
  });
});

describe("username validation", function () {
  it("returns 400 for non-string username", async function () {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({ ...VALID_USER_DATA, username: 12345 });

    expect400WithMessage(res, "username must be a string.");
  });

  it.each([
    {
      username: "abc",
      message: "username must be between 4 and 20 characters long.",
    },
    {
      username: "a".repeat(21),
      message: "username must be between 4 and 20 characters long.",
    },
  ])(
    "returns 400 for invalid username length: $username",
    async ({ username, message }) => {
      const res = await request(app)
        .post("/api/v1/auth/signup")
        .send({ ...VALID_USER_DATA, username });

      expect400WithMessage(res, message);
    },
  );

  it.each([
    { username: "user@name!", desc: "special characters" },
    { username: "user name", desc: "spaces" },
  ])("returns 400 for username with $desc", async ({ username }) => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({ ...VALID_USER_DATA, username });

    expect400WithMessage(
      res,
      "username may only contain letters, numbers, and underscores.",
    );
  });

  it.each([
    { username: "valid_user123", email: "valid_user123@example.com" },
    { username: "user", email: "user4@example.com" },
    { username: "a".repeat(20), email: "twentychar@example.com" },
  ])("accepts valid username: $username", async ({ username, email }) => {
    const res = await request(app).post("/api/v1/auth/signup").send({
      username,
      password: "SecurePassword123!",
      email,
    });

    expectJsonResponse(res, 201);
    expect(res.body.data).toHaveProperty("userId");
  });
});

describe("Email validation", function () {
  it("returns 400 for non-string email", async function () {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({ ...VALID_USER_DATA, email: 12345 });

    expect400WithMessage(res, "email must be a string.");
  });

  it("returns 400 for email longer than 254 characters", async function () {
    const longEmail = "a".repeat(250) + "@test.com";
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({ ...VALID_USER_DATA, email: longEmail });

    expect400WithMessage(res, "email must not be longer than 254 characters.");
  });

  it.each([
    {
      email: "test user@example.com",
      message: "email must not contain whitespace.",
    },
    {
      email: "invalidemail.com",
      message: "email must be a valid email address.",
    },
    { email: "invalid@", message: "email must be a valid email address." },
    { email: "", message: "email must be a valid email address." },
  ])("returns 400 for invalid email: $email", async ({ email, message }) => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({ ...VALID_USER_DATA, email });

    expect400WithMessage(res, message);
  });

  it.each([
    { email: "valid.email@example.com", username: "validemail" },
    { email: "user@mail.example.com", username: "subdomain" },
  ])("accepts valid email: $email", async ({ email, username }) => {
    const res = await request(app).post("/api/v1/auth/signup").send({
      username,
      password: "SecurePassword123!",
      email,
    });

    expectJsonResponse(res, 201);
    expect(res.body.data).toHaveProperty("userId");
  });
});

describe("Password validation", function () {
  it("returns 400 for non-string password", async function () {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({ ...VALID_USER_DATA, password: 12345 });

    expect400WithMessage(res, "password must be a string.");
  });

  it.each([
    {
      password: "Short1!",
      message: "password must be at least 8 characters long.",
    },
    {
      password: "a".repeat(129),
      message: "password must be at most 128 characters long.",
    },
  ])(
    "returns 400 for password with invalid length",
    async ({ password, message }) => {
      const res = await request(app)
        .post("/api/v1/auth/signup")
        .send({ ...VALID_USER_DATA, password });

      expect400WithMessage(res, message);
    },
  );

  it.each([
    {
      password: "ValidPass123",
      username: "pass12char",
      email: "pass12char@example.com",
    },
    {
      password: "a".repeat(128),
      username: "pass128char",
      email: "pass128char@example.com",
    },
    {
      password: "P@ssw0rd!#$%^&*()",
      username: "passspecial",
      email: "passspecial@example.com",
    },
  ])("accepts valid password", async ({ password, username, email }) => {
    const res = await request(app).post("/api/v1/auth/signup").send({
      username,
      password,
      email,
    });

    expectJsonResponse(res, 201);
    expect(res.body.data).toHaveProperty("userId");
  });
});

describe("Uniqueness validation", function () {
  it("returns 409 for duplicate username", async function () {
    const firstUser = {
      username: "unique_user_001",
      password: "FirstPassword123!",
      email: "first@example.com",
    };
    await request(app).post("/api/v1/auth/signup").send(firstUser);

    const duplicateUsernameUser = {
      username: "unique_user_001",
      password: "DifferentPassword123!",
      email: "different@example.com",
    };
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send(duplicateUsernameUser);

    expect409Error(res);
  });

  it("returns 409 for duplicate email", async function () {
    const firstUser = {
      username: "unique_user_002",
      password: "FirstPassword123!",
      email: "duplicate@example.com",
    };
    await request(app).post("/api/v1/auth/signup").send(firstUser);

    const duplicateEmailUser = {
      username: "different_user",
      password: "DifferentPassword123!",
      email: "duplicate@example.com",
    };
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send(duplicateEmailUser);

    expect409Error(res);
  });

  it("handles concurrent duplicate requests safely", async function () {
    const userA = {
      username: "race_user",
      password: "Password123!",
      email: "a@example.com",
    };
    const userB = {
      username: "race_user",
      password: "Password456!",
      email: "b@example.com",
    };

    const results = await Promise.allSettled([
      request(app).post("/api/v1/auth/signup").send(userA),
      request(app).post("/api/v1/auth/signup").send(userB),
    ]);

    const statuses = results.map((r) =>
      r.status === "fulfilled" ? r.value.statusCode : undefined,
    );
    expect(statuses).toContain(201);
    expect(statuses).toContain(409);
  });
});

describe("Successful registration", function () {
  it("returns 201 for valid user data", async function () {
    const res = await request(app).post("/api/v1/auth/signup").send({
      username: "newuser123",
      password: "SecurePassword123!",
      email: "newuser123@example.com",
    });

    expectJsonResponse(res, 201);
    expect(res.body.data).toHaveProperty("userId");
  });

  it("returns 201 for valid user with all allowed characters", async function () {
    const res = await request(app).post("/api/v1/auth/signup").send({
      username: "user_name_123",
      password: "SecureP@ssw0rd!",
      email: "user.name+tag@example.co.uk",
    });

    expectJsonResponse(res, 201);
    expect(res.body.data).toHaveProperty("userId");
  });
});
