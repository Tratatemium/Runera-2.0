import { MongoMemoryServer } from "mongodb-memory-server";
import * as dbUtils from "../../src/utils/db.utils.js";

let mongo: MongoMemoryServer;

async function setup() {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await dbUtils.connectDB(uri);
}

async function teardown() {
  await dbUtils.closeDB();
  await mongo.stop();
}

async function clear() {
  await dbUtils.clearDB();
}

export { setup, teardown, clear };
