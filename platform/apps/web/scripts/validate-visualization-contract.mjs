import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { analyticsFactsSchema } from "../src/lib/visualization/contract.ts";
import { analyzeData } from "../public/vendor/embeddable-analytics/analyzer.js";
import { recommendDashboard } from "../public/vendor/embeddable-analytics/recommender.js";

const fixturesDirectory = fileURLToPath(
  new URL("../../../contracts/visualization/examples/", import.meta.url),
);
const widgetSourcePath = fileURLToPath(
  new URL("../public/vendor/embeddable-analytics/widget.js", import.meta.url),
);
const packagePath = fileURLToPath(new URL("../package.json", import.meta.url));

const fixtureNames = (await readdir(fixturesDirectory)).filter((name) =>
  name.endsWith(".facts.json"),
);

if (fixtureNames.length === 0) {
  throw new Error("No analytics fact compatibility fixtures were found.");
}

for (const fixtureName of fixtureNames) {
  const raw = await readFile(`${fixturesDirectory}/${fixtureName}`, "utf8");
  const payload = JSON.parse(raw);
  const result = analyticsFactsSchema.safeParse(payload);

  if (!result.success) {
    console.error(`Invalid analytics facts fixture: ${fixtureName}`);
    console.error(result.error.issues);
    process.exitCode = 1;
    continue;
  }

  const profiles = analyzeData(result.data.facts);
  const dashboard = recommendDashboard(profiles, result.data.facts);
  if (
    dashboard.kpis.length === 0 ||
    dashboard.charts.length === 0 ||
    dashboard.tableData.length === 0
  ) {
    throw new Error(
      `Embeddable analytics did not recommend a complete dashboard for ${fixtureName}.`,
    );
  }
}

const firstFixture = JSON.parse(
  await readFile(`${fixturesDirectory}/${fixtureNames[0]}`, "utf8"),
);
const failClosedProbe = analyticsFactsSchema.safeParse({
  ...firstFixture,
  frontendCalculatedTotal: 999,
});
if (failClosedProbe.success) {
  throw new Error("Analytics facts contract accepted an unknown field.");
}

const packageJson = JSON.parse(await readFile(packagePath, "utf8"));
if (packageJson.dependencies?.recharts) {
  throw new Error("Recharts must not be present in the FedPulse web package.");
}

const widgetSource = await readFile(widgetSourcePath, "utf8");
const requiredCapabilities = [
  "vega-embed@6.26.0/+esm",
  "html-to-image@1.11.13/+esm",
  "customElements.define('chart-widget'",
  "layout-mode",
  "chart-layout",
  "chart-config",
  "dashboard-feedback",
  "Swap to Donut",
  "Toggle Average Line",
  "toPng",
];
for (const capability of requiredCapabilities) {
  if (!widgetSource.includes(capability)) {
    throw new Error(`Embeddable analytics capability missing: ${capability}`);
  }
}

if (!process.exitCode) {
  console.log(
    `Validated ${fixtureNames.length} governed fact fixture(s) and the embeddable analytics capability surface.`,
  );
}
