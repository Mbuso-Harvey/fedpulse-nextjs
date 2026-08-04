import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { analyticsWidgetSchema } from "../src/lib/visualization/contract.ts";

const fixturesDirectory = fileURLToPath(
  new URL("../../../contracts/visualization/examples/", import.meta.url),
);

const fixtureNames = (await readdir(fixturesDirectory)).filter((name) =>
  name.endsWith(".json"),
);

if (fixtureNames.length === 0) {
  throw new Error("No visualization compatibility fixtures were found.");
}

for (const fixtureName of fixtureNames) {
  const raw = await readFile(`${fixturesDirectory}/${fixtureName}`, "utf8");
  const payload = JSON.parse(raw);
  const result = analyticsWidgetSchema.safeParse(payload);

  if (!result.success) {
    console.error(`Invalid visualization fixture: ${fixtureName}`);
    console.error(result.error.issues);
    process.exitCode = 1;
  }
}

const validFixture = JSON.parse(
  await readFile(`${fixturesDirectory}/${fixtureNames[0]}`, "utf8"),
);
const failClosedProbe = analyticsWidgetSchema.safeParse({
  ...validFixture,
  frontendCalculatedTotal: 999,
});

if (failClosedProbe.success) {
  throw new Error("Visualization contract accepted an unknown analytics field.");
}

if (!process.exitCode) {
  console.log(
    `Validated ${fixtureNames.length} FedPulse visualization compatibility fixture(s).`,
  );
}
