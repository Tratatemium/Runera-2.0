import dotenv from "dotenv";
import { afterAll, beforeAll } from "@jest/globals";

dotenv.config();

import * as testDb from "./testDB.setup.js";
import * as seeding from "../helpers/seeding.js";
import User from "../../src/models/users.models.js";
import Run from "../../src/models/runs.models.js";

beforeAll(async () => {
  await testDb.setup();
  await seeding.seedData(User, "users");
  await seeding.seedData(Run, "runs");
});

afterAll(async () => {
  await testDb.clear();
  await testDb.teardown();
});
