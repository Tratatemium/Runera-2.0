import type { Model } from "mongoose";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedData<T>(model: Model<T>, pathName: string) {
  if (!model || !model.collection) {
    throw new Error("A valid Mongoose model must be provided");
  }

  const filePath = path.join(
    __dirname,
    "..",
    "fixtures",
    `${pathName}.fixture.json`,
  );
  const rawData = fs.readFileSync(filePath, "utf8");
  const documents = JSON.parse(rawData);

  await model.insertMany(documents);
}

export { seedData };
