import dotenv from "dotenv";
import { afterAll, beforeAll } from "@jest/globals";

dotenv.config();

import * as testDb from "./testDB.setup.js";
import * as seeding from "../helpers/seeding.js";
import User from "../../src/models/users.models.js";
import Run from "../../src/models/runs.models.js";

beforeAll(async () => {
  console.time("mongo setup");
  await testDb.setup();
  console.timeEnd("mongo setup");

  console.time("user seed");
  await seeding.seedData(User, "users");
  console.timeEnd("user seed");

  console.time("run seed");
  await seeding.seedData(Run, "runs");
  console.timeEnd("run seed");
}, 30000);

afterAll(async () => {
  await testDb.clear();
  await testDb.teardown();
});
