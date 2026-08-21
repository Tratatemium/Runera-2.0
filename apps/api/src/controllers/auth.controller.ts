import type { Request, Response } from "express";

import * as authService from "../services/auth.service.js";
import { sendSuccess } from "../utils/response.utils.js";

async function createUser(req, res) {
  const { email, username, password } = req.body;
  const newUserId = await authService.signup(email, username, password);
  sendSuccess(res, { statusCode: 201, data: { userId: newUserId } });
}

async function loginUser(req, res) {
  const { email, username, password } = req.body;
  const identifier = email ? email : username;
  const token = await authService.login(identifier, password);
  sendSuccess(res, {
    statusCode: 200,
    cookie: { name: "token", value: token },
  });
}

async function logout(req, res) {
  sendSuccess(res, {
    statusCode: 200,
    cookie: {
      name: "token",
      value: "",
      options: {
        maxAge: 0,
      },
    },
    data: { message: "Logged out successfully." },
  });
}

async function logoutAll(req, res) {
  const { userId } = req.user;
  await authService.invalidatePreviousAccessTokens(userId);
  res.sendStatus(200);
}

export { createUser, loginUser, logout, logoutAll };
