import type { Model } from "mongoose";

import fs from "fs";
import path from "path";

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
