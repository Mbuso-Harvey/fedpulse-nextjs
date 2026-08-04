import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { analyticsFactsSchema } from "../src/lib/visualization/contract.ts";
import { analyzeData } from "../public/vendor/embeddable-analytics/analyzer.js";
import {
  APPROVED_VISUAL_IDS,
  VISUAL_REGISTRY_VERSION,
  recommendDashboard,
} from "../public/vendor/embeddable-analytics/recommender.js";

const fixturesDirectory = fileURLToPath(
  new URL("../../../contracts/visualization/examples/", import.meta.url),
);
const widgetSourcePath = fileURLToPath(
  new URL("../public/vendor/embeddable-analytics/widget.js", import.meta.url),
);
const recommenderPath = fileURLToPath(
  new URL("../public/vendor/embeddable-analytics/recommender.js", import.meta.url),
);
const registryPath = fileURLToPath(
  new URL("../public/vendor/embeddable-analytics/visual-registry.js", import.meta.url),
);
const packagePath = fileURLToPath(new URL("../package.json", import.meta.url));
const packageLockPath = fileURLToPath(
  new URL("../package-lock.json", import.meta.url),
);

const fixtureNames = (await readdir(fixturesDirectory))
  .filter((name) => name.endsWith(".facts.json"))
  .sort();

if (fixtureNames.length < 3) {
  throw new Error(
    "Enterprise analytics requires renewal, flow, and geographic fixtures.",
  );
}

function attachEnterpriseContext(facts, payload) {
  const cloned = facts.map((row) => ({ ...row }));
  const context = {
    semanticModel: payload.semanticModel,
    decision: {
      ...payload.decision,
      preferredVisualId:
        payload.decision.preferredVisualId ?? payload.presentation.visualId,
    },
    visualPolicy: payload.visualPolicy,
    presentation: payload.presentation,
    selectionAudit: null,
  };
  Object.defineProperty(cloned, "__fedpulseContext", {
    value: context,
    enumerable: false,
  });
  return { facts: cloned, context };
}

function recommend(payload) {
  const attached = attachEnterpriseContext(payload.facts, payload);
  const dashboard = recommendDashboard(
    analyzeData(attached.facts),
    attached.facts,
  );
  if (!attached.context.selectionAudit) {
    throw new Error("Enterprise recommender did not emit a selection audit.");
  }
  return dashboard;
}

const dashboards = new Map();
for (const fixtureName of fixtureNames) {
  const raw = await readFile(`${fixturesDirectory}/${fixtureName}`, "utf8");
  const payload = JSON.parse(raw);
  const result = analyticsFactsSchema.safeParse(payload);

  if (!result.success) {
    console.error(`Invalid enterprise analytics fixture: ${fixtureName}`);
    console.error(result.error.issues);
    process.exitCode = 1;
    continue;
  }

  const dashboard = recommend(result.data);
  dashboards.set(fixtureName, { payload: result.data, dashboard });

  if (dashboard.registryVersion !== VISUAL_REGISTRY_VERSION) {
    throw new Error(`${fixtureName} used an unexpected visual registry.`);
  }
  if (dashboard.selectionAudit.registryVersion !== VISUAL_REGISTRY_VERSION) {
    throw new Error(`${fixtureName} selection audit omitted registry version.`);
  }
  if (!dashboard.selectionAudit.safeguards.includes("approved-registry-only")) {
    throw new Error(`${fixtureName} omitted registry enforcement.`);
  }
  if (
    dashboard.charts.some(
      (chart) => !APPROVED_VISUAL_IDS.includes(chart.visualId),
    )
  ) {
    throw new Error(`${fixtureName} selected an unapproved visual.`);
  }
  if (
    dashboard.charts.some(
      (chart) =>
        chart.confidence < result.data.visualPolicy.minimumConfidence,
    )
  ) {
    throw new Error(`${fixtureName} selected a low-confidence visual.`);
  }

  const families = new Map();
  const signatures = new Set();
  for (const chart of dashboard.charts) {
    families.set(chart.family, (families.get(chart.family) || 0) + 1);
    if (signatures.has(chart.signature)) {
      throw new Error(`${fixtureName} selected a redundant analytical view.`);
    }
    signatures.add(chart.signature);
  }
  if (
    [...families.values()].some(
      (count) => count > result.data.visualPolicy.maxPerFamily,
    )
  ) {
    throw new Error(`${fixtureName} violated the visual-family limit.`);
  }
  if (
    result.data.visualPolicy.requireTableFallback &&
    dashboard.tableData.length === 0
  ) {
    throw new Error(`${fixtureName} omitted the accessible table fallback.`);
  }
}

const renewal = dashboards.get("renewal-intelligence.facts.json");
if (!renewal) throw new Error("Renewal fixture was not validated.");
const renewalIds = renewal.dashboard.charts.map((chart) => chart.visualId);
if (!renewalIds.includes("comparison.dot.v1")) {
  throw new Error(
    "Recent-use penalty did not diversify the renewal comparison visual.",
  );
}
if (renewalIds.includes("comparison.bar.v1")) {
  throw new Error(
    "Redundancy policy selected both bar and dot views for the same question.",
  );
}
const daysKpi = renewal.dashboard.kpis.find(
  (kpi) => kpi.field === "daysUntilExpiry",
);
if (!daysKpi || daysKpi.aggregation !== "median") {
  throw new Error("Non-additive duration metric was not governed as median.");
}

const reorderedRenewal = structuredClone(renewal.payload);
reorderedRenewal.facts = reorderedRenewal.facts.map((row) =>
  Object.fromEntries(Object.entries(row).reverse()),
);
reorderedRenewal.semanticModel.fields = [
  ...reorderedRenewal.semanticModel.fields,
].reverse();
const reorderedIds = recommend(reorderedRenewal).charts.map(
  (chart) => chart.visualId,
);
if (JSON.stringify(reorderedIds) !== JSON.stringify(renewalIds)) {
  throw new Error("Visual selection changed when JSON field order changed.");
}

const flow = dashboards.get("contract-flow.facts.json");
if (!flow) throw new Error("Flow fixture was not validated.");
if (flow.dashboard.charts[0]?.visualId !== "flow.sankey.v1") {
  throw new Error("Flow intent did not select the approved Sankey template.");
}
if (
  flow.dashboard.charts[0].spec.$schema !==
  "https://vega.github.io/schema/vega/v5.json"
) {
  throw new Error("Sankey template is not a governed full Vega spec.");
}
const invalidFlow = structuredClone(flow.payload);
invalidFlow.facts = invalidFlow.facts.map((row) => ({
  ...row,
  contractValue: -Math.abs(row.contractValue),
}));
if (
  recommend(invalidFlow).charts.some(
    (chart) => chart.visualId === "flow.sankey.v1",
  )
) {
  throw new Error("Sankey accepted non-positive flow weights.");
}

const location = dashboards.get("contract-location.facts.json");
if (!location) throw new Error("Geographic fixture was not validated.");
if (location.dashboard.charts[0]?.visualId !== "geo.point-map.v1") {
  throw new Error(
    "Geographic intent did not select the approved point-map template.",
  );
}
if (!location.dashboard.charts[0].spec.projection) {
  throw new Error("Point-map template omitted its governed projection.");
}

const firstFixture = renewal.payload;
const failClosedProbe = analyticsFactsSchema.safeParse({
  ...firstFixture,
  frontendCalculatedTotal: 999,
});
if (failClosedProbe.success) {
  throw new Error("Enterprise facts contract accepted an unknown field.");
}

const customSpecProbe = structuredClone(firstFixture);
customSpecProbe.presentation.spec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  mark: "bar",
};
if (analyticsFactsSchema.safeParse(customSpecProbe).success) {
  throw new Error("Custom Vega specification bypassed the governed policy.");
}

const packageJson = JSON.parse(await readFile(packagePath, "utf8"));
const packageLock = await readFile(packageLockPath, "utf8");
if (packageJson.dependencies?.recharts || packageLock.includes("recharts")) {
  throw new Error("Recharts must not be present in the FedPulse web package.");
}

const widgetSource = await readFile(widgetSourcePath, "utf8");
const recommenderSource = await readFile(recommenderPath, "utf8");
const registrySource = await readFile(registryPath, "utf8");
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
for (const safeguard of [
  "approved-registry-only",
  "duplicate-signature-rejection",
  "recent-visual-penalty",
  "minimum-confidence-threshold",
  "flow.sankey.v1",
  "geo.point-map.v1",
]) {
  if (
    !recommenderSource.includes(safeguard) &&
    !registrySource.includes(safeguard)
  ) {
    throw new Error(`Enterprise visual safeguard missing: ${safeguard}`);
  }
}

if (!process.exitCode) {
  console.log(
    `Validated ${fixtureNames.length} enterprise fact fixture(s), ${APPROVED_VISUAL_IDS.length} approved visuals, semantic governance, diversity controls, Sankey, map, accessibility fallback, and Recharts absence.`,
  );
}
