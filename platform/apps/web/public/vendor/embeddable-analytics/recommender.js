import {
  APPROVED_VISUAL_IDS,
  VISUAL_REGISTRY,
  VISUAL_REGISTRY_VERSION,
  getVisualDefinition,
} from "./visual-registry.js";

const DEFAULT_POLICY = Object.freeze({
  maxCharts: 4,
  maxPerFamily: 1,
  minimumConfidence: 0.62,
  recentVisualIds: [],
  allowedVisualIds: [],
  deniedVisualIds: [],
  diversityWeight: 1,
  requireTableFallback: true,
  allowCustomSpec: false,
  accessibilityMode: "standard",
  maxCategories: 30,
  maxHeatmapCardinality: 12,
  maxSankeyNodes: 40,
  maxSankeyLinks: 150,
  maxMapPoints: 2000,
});

const AGGREGATIONS = new Set([
  "sum",
  "mean",
  "median",
  "min",
  "max",
  "count",
  "distinct_count",
  "none",
]);

const INTENT_BOOSTS = Object.freeze({
  overview: {
    "trend.line.v1": 14,
    "comparison.bar.v1": 13,
    "comparison.dot.v1": 12,
    "distribution.histogram.v1": 7,
    "relationship.scatter.v1": 6,
    "composition.treemap.v1": 8,
  },
  trend: { "trend.line.v1": 30 },
  comparison: {
    "comparison.bar.v1": 27,
    "comparison.dot.v1": 29,
    "relationship.heatmap.v1": 10,
  },
  ranking: {
    "comparison.dot.v1": 31,
    "comparison.bar.v1": 27,
  },
  distribution: { "distribution.histogram.v1": 31 },
  relationship: {
    "relationship.scatter.v1": 31,
    "relationship.heatmap.v1": 18,
  },
  composition: {
    "composition.treemap.v1": 31,
    "comparison.bar.v1": 11,
  },
  concentration: {
    "composition.treemap.v1": 29,
    "relationship.heatmap.v1": 24,
    "comparison.bar.v1": 15,
  },
  flow: { "flow.sankey.v1": 38 },
  transition: { "flow.sankey.v1": 38 },
  allocation: { "flow.sankey.v1": 35 },
  geography: { "geo.point-map.v1": 38 },
  "regional-comparison": {
    "geo.point-map.v1": 34,
    "comparison.dot.v1": 15,
  },
  location: { "geo.point-map.v1": 38 },
});

function clamp(value, minimum = 0, maximum = 1) {
  return Math.max(minimum, Math.min(maximum, value));
}

function capitalize(value) {
  if (!value) return "";
  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function parseContext(data) {
  const context = data && data.__fedpulseContext;
  if (!context || typeof context !== "object") {
    return {
      semanticModel: { registryVersion: VISUAL_REGISTRY_VERSION, fields: [] },
      decision: { intent: "overview", question: null, preferredVisualId: null },
      visualPolicy: {},
      selectionAudit: null,
    };
  }
  return context;
}

function normalizePolicy(input = {}) {
  const policy = { ...DEFAULT_POLICY, ...(input || {}) };
  policy.maxCharts = Math.max(1, Math.min(8, Number(policy.maxCharts) || 4));
  policy.maxPerFamily = Math.max(
    1,
    Math.min(policy.maxCharts, Number(policy.maxPerFamily) || 1),
  );
  policy.minimumConfidence = clamp(
    Number(policy.minimumConfidence) || DEFAULT_POLICY.minimumConfidence,
  );
  policy.diversityWeight = clamp(
    Number(policy.diversityWeight) || DEFAULT_POLICY.diversityWeight,
    0,
    2,
  );
  policy.recentVisualIds = Array.isArray(policy.recentVisualIds)
    ? policy.recentVisualIds.filter((id) => typeof id === "string").slice(-50)
    : [];
  policy.allowedVisualIds = Array.isArray(policy.allowedVisualIds)
    ? policy.allowedVisualIds.filter((id) => APPROVED_VISUAL_IDS.includes(id))
    : [];
  policy.deniedVisualIds = Array.isArray(policy.deniedVisualIds)
    ? policy.deniedVisualIds.filter((id) => APPROVED_VISUAL_IDS.includes(id))
    : [];
  return policy;
}

function normalizeSemanticFields(semanticModel, data, profiles) {
  const rawFields = Array.isArray(semanticModel?.fields)
    ? semanticModel.fields
    : [];
  const dataKeys = data.length ? Object.keys(data[0]) : [];

  const explicitFields = rawFields
    .filter((item) => item && dataKeys.includes(item.field))
    .map((item) => ({
      field: item.field,
      label: item.label || capitalize(item.field),
      roles: Array.isArray(item.roles) ? [...new Set(item.roles)] : [],
      semanticType: item.semanticType || "number",
      defaultAggregation: AGGREGATIONS.has(item.defaultAggregation)
        ? item.defaultAggregation
        : "none",
      allowedAggregations: Array.isArray(item.allowedAggregations)
        ? item.allowedAggregations.filter((value) => AGGREGATIONS.has(value))
        : [],
      currency: item.currency || null,
      unit: item.unit || null,
      priority: Number.isFinite(item.priority) ? item.priority : 50,
      hierarchy: Array.isArray(item.hierarchy) ? item.hierarchy : [],
      sensitivity: item.sensitivity || "internal",
      quality: {
        coverage: clamp(Number(item.quality?.coverage ?? 1)),
        confidence: clamp(Number(item.quality?.confidence ?? 1)),
      },
    }))
    .sort((a, b) => b.priority - a.priority || a.field.localeCompare(b.field));

  if (explicitFields.length) return explicitFields;

  return dataKeys
    .map((field) => {
      const profile = profiles[field] || {};
      const lower = field.toLowerCase();
      const roles = [];
      let semanticType = "category";
      let defaultAggregation = "none";
      let allowedAggregations = ["none"];

      if (/latitude|(^|_)lat$/.test(lower)) {
        roles.push("latitude");
        semanticType = "latitude";
      } else if (/longitude|(^|_)(lon|lng)$/.test(lower)) {
        roles.push("longitude");
        semanticType = "longitude";
      } else if (profile.type === "date") {
        roles.push("time");
        semanticType = "date";
      } else if (profile.type === "number") {
        roles.push("measure");
        semanticType = /value|amount|cost|spend|budget|price|revenue/.test(lower)
          ? "currency"
          : "number";
        defaultAggregation = /days|percent|rate|score|year/.test(lower)
          ? "median"
          : "sum";
        allowedAggregations = [defaultAggregation, "mean", "median", "min", "max"];
      } else if ((profile.cardinalityRatio || 0) >= 0.8) {
        roles.push("identifier");
        semanticType = "identifier";
      } else {
        roles.push("dimension");
      }

      return {
        field,
        label: capitalize(field),
        roles,
        semanticType,
        defaultAggregation,
        allowedAggregations,
        currency: semanticType === "currency" ? "CAD" : null,
        unit: null,
        priority: 10,
        hierarchy: [],
        sensitivity: "internal",
        quality: { coverage: 0.75, confidence: 0.55 },
      };
    })
    .sort((a, b) => a.field.localeCompare(b.field));
}

function fieldsWithRole(fields, role) {
  return fields.filter((field) => field.roles.includes(role));
}

function fieldByRole(fields, role, index = 0) {
  return fieldsWithRole(fields, role)[index] || null;
}

function fieldQuality(field) {
  if (!field) return 0;
  return clamp((field.quality.coverage + field.quality.confidence) / 2);
}

function averageQuality(fields) {
  const usable = fields.filter(Boolean);
  if (!usable.length) return 0;
  return usable.reduce((sum, field) => sum + fieldQuality(field), 0) / usable.length;
}

function aggregate(values, method) {
  const valid = values.filter((value) => typeof value === "number" && Number.isFinite(value));
  if (method === "count") return values.filter((value) => value !== null && value !== undefined).length;
  if (method === "distinct_count") return new Set(values.filter((value) => value !== null && value !== undefined)).size;
  if (!valid.length) return null;
  if (method === "sum") return valid.reduce((sum, value) => sum + value, 0);
  if (method === "mean") return valid.reduce((sum, value) => sum + value, 0) / valid.length;
  if (method === "min") return Math.min(...valid);
  if (method === "max") return Math.max(...valid);
  if (method === "median") {
    const sorted = [...valid].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2
      ? sorted[middle]
      : (sorted[middle - 1] + sorted[middle]) / 2;
  }
  return null;
}

function formatValue(value, field) {
  if (value === null || value === undefined) return "Unavailable";
  if (field.semanticType === "currency") {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: field.currency || "CAD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }
  if (field.semanticType === "percentage") {
    return new Intl.NumberFormat("en-CA", {
      style: "percent",
      maximumFractionDigits: 1,
    }).format(Math.abs(value) > 1 ? value / 100 : value);
  }
  return new Intl.NumberFormat("en-CA", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function numberFormat(field) {
  if (!field) return ".2s";
  if (field.semanticType === "currency") return "$.2s";
  if (field.semanticType === "percentage") return ".1%";
  return ".2s";
}

function tooltipFormat(field) {
  if (!field) return ",.2f";
  if (field.semanticType === "currency") return "$,.0f";
  if (field.semanticType === "percentage") return ".1%";
  return ",.2f";
}

function visualAllowed(visualId, policy) {
  if (!APPROVED_VISUAL_IDS.includes(visualId)) return false;
  if (policy.deniedVisualIds.includes(visualId)) return false;
  if (
    policy.allowedVisualIds.length &&
    !policy.allowedVisualIds.includes(visualId)
  ) {
    return false;
  }
  return true;
}

function intentBoost(intent, visualId) {
  return INTENT_BOOSTS[intent]?.[visualId] || 0;
}

function recentPenalty(visualId, policy) {
  const recent = policy.recentVisualIds;
  let penalty = 0;
  recent.forEach((id, index) => {
    if (id !== visualId) return;
    const recency = (index + 1) / recent.length;
    penalty += 8 + 12 * recency;
  });
  return penalty * policy.diversityWeight;
}

function makeCandidate({
  visualId,
  fields,
  signature,
  spec,
  title,
  confidence,
  reasons,
  warnings = [],
  dataRows,
  decision,
  policy,
}) {
  const definition = getVisualDefinition(visualId);
  const preferred =
    decision.preferredVisualId === visualId ? 24 : 0;
  const score =
    definition.baseScore +
    intentBoost(decision.intent, visualId) +
    averageQuality(fields) * 16 +
    definition.accessibilityScore * 8 -
    definition.complexity * 12 -
    recentPenalty(visualId, policy) +
    preferred;

  return {
    id: visualId,
    visualId,
    family: definition.family,
    renderer: definition.renderer,
    title,
    score: Number(score.toFixed(3)),
    confidence: Number(clamp(confidence).toFixed(3)),
    signature,
    spec,
    reasons,
    warnings,
    fallbackVisualId: definition.fallback,
    rowCount: dataRows.length,
  };
}

function premiumConfig(policy, themeConfig) {
  const highContrast = policy.accessibilityMode === "high-contrast";
  return {
    font: "inherit",
    view: { stroke: "transparent" },
    axis: {
      domainColor: highContrast ? "#334155" : "#e2e8f0",
      tickColor: highContrast ? "#334155" : "#e2e8f0",
      labelColor: highContrast ? "#0f172a" : "#64748b",
      titleColor: "#334155",
      titleFontWeight: 600,
      gridColor: highContrast ? "#94a3b8" : "#f1f5f9",
      gridDash: [4, 4],
      labelFontSize: 11,
    },
    legend: {
      labelColor: highContrast ? "#0f172a" : "#475569",
      titleColor: "#334155",
      titleFontWeight: 600,
    },
    range: {
      category: [
        themeConfig.primaryColor || "#2563eb",
        themeConfig.secondaryColor || "#d97706",
        "#059669",
        "#7c3aed",
        "#dc2626",
        "#0891b2",
      ],
    },
  };
}

function categoryCardinality(data, field) {
  return new Set(
    data
      .map((row) => row[field.field])
      .filter((value) => value !== null && value !== undefined),
  ).size;
}

function buildKpis(fields, data) {
  return fieldsWithRole(fields, "measure")
    .filter((field) => field.defaultAggregation !== "none")
    .slice(0, 4)
    .map((field) => {
      const value = aggregate(
        data.map((row) => row[field.field]),
        field.defaultAggregation,
      );
      return {
        label: `${capitalize(field.defaultAggregation)} ${field.label}`,
        value: formatValue(value, field),
        field: field.field,
        aggregation: field.defaultAggregation,
        semanticType: field.semanticType,
      };
    })
    .filter((kpi) => kpi.value !== "Unavailable");
}

function buildTrendCandidate(fields, data, decision, policy, config) {
  const time = fieldByRole(fields, "time");
  const measure = fieldByRole(fields, "measure");
  if (!time || !measure || measure.defaultAggregation === "none") return null;

  const aggregation = measure.defaultAggregation;
  const title = `${measure.label} trend`;
  return makeCandidate({
    visualId: "trend.line.v1",
    fields: [time, measure],
    signature: `trend|${time.field}|${measure.field}|${aggregation}`,
    title,
    confidence: 0.72 + averageQuality([time, measure]) * 0.24,
    reasons: [
      `The semantic model identifies ${time.label} as time.`,
      `${measure.label} permits ${aggregation} aggregation.`,
    ],
    dataRows: data,
    decision,
    policy,
    spec: {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      width: "container",
      height: 320,
      data: { values: data },
      mark: {
        type: "line",
        point: true,
        strokeWidth: 3,
        interpolate: "monotone",
      },
      encoding: {
        x: {
          field: time.field,
          type: "temporal",
          axis: { title: time.label, grid: false },
        },
        y: {
          aggregate: aggregation,
          field: measure.field,
          type: "quantitative",
          axis: {
            title: `${capitalize(aggregation)} ${measure.label}`,
            format: numberFormat(measure),
          },
        },
        tooltip: [
          { field: time.field, type: "temporal", title: time.label },
          {
            aggregate: aggregation,
            field: measure.field,
            type: "quantitative",
            title: measure.label,
            format: tooltipFormat(measure),
          },
        ],
      },
      config,
    },
  });
}

function buildComparisonCandidates(fields, data, decision, policy, config) {
  const dimension = fieldByRole(fields, "dimension");
  const measure = fieldByRole(fields, "measure");
  if (!dimension || !measure || measure.defaultAggregation === "none") return [];

  const cardinality = categoryCardinality(data, dimension);
  if (cardinality < 2 || cardinality > policy.maxCategories) return [];

  const aggregation = measure.defaultAggregation;
  const signature = `comparison|${dimension.field}|${measure.field}|${aggregation}`;
  const sharedEncoding = {
    y: {
      field: dimension.field,
      type: "nominal",
      sort: "-x",
      axis: { title: null, labelLimit: 220 },
    },
    x: {
      aggregate: aggregation,
      field: measure.field,
      type: "quantitative",
      axis: {
        title: `${capitalize(aggregation)} ${measure.label}`,
        format: numberFormat(measure),
      },
    },
    tooltip: [
      { field: dimension.field, type: "nominal", title: dimension.label },
      {
        aggregate: aggregation,
        field: measure.field,
        type: "quantitative",
        title: measure.label,
        format: tooltipFormat(measure),
      },
    ],
  };

  return [
    makeCandidate({
      visualId: "comparison.bar.v1",
      fields: [dimension, measure],
      signature,
      title: `${measure.label} by ${dimension.label}`,
      confidence: 0.75 + averageQuality([dimension, measure]) * 0.2,
      reasons: [
        `${dimension.label} is an approved comparison dimension.`,
        `${cardinality} categories are within the ${policy.maxCategories}-category limit.`,
      ],
      dataRows: data,
      decision,
      policy,
      spec: {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        width: "container",
        height: Math.max(240, Math.min(620, cardinality * 28)),
        data: { values: data },
        mark: { type: "bar", cornerRadiusEnd: 4 },
        encoding: sharedEncoding,
        config,
      },
    }),
    makeCandidate({
      visualId: "comparison.dot.v1",
      fields: [dimension, measure],
      signature,
      title: `${measure.label} by ${dimension.label}`,
      confidence: 0.77 + averageQuality([dimension, measure]) * 0.2,
      reasons: [
        `${dimension.label} is an approved comparison dimension.`,
        "A dot plot reduces ink while preserving ranked comparison accuracy.",
      ],
      dataRows: data,
      decision,
      policy,
      spec: {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        width: "container",
        height: Math.max(240, Math.min(620, cardinality * 28)),
        data: { values: data },
        mark: { type: "point", filled: true, size: 110 },
        encoding: sharedEncoding,
        config,
      },
    }),
  ];
}

function buildHistogramCandidate(fields, data, decision, policy, config) {
  const measure = fieldByRole(fields, "measure");
  if (!measure) return null;
  return makeCandidate({
    visualId: "distribution.histogram.v1",
    fields: [measure],
    signature: `distribution|${measure.field}`,
    title: `${measure.label} distribution`,
    confidence: 0.7 + fieldQuality(measure) * 0.24,
    reasons: [`${measure.label} is a governed quantitative measure.`],
    dataRows: data,
    decision,
    policy,
    spec: {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      width: "container",
      height: 280,
      data: { values: data },
      mark: { type: "bar", cornerRadiusEnd: 3 },
      encoding: {
        x: {
          bin: { maxbins: 20 },
          field: measure.field,
          type: "quantitative",
          axis: { title: measure.label, format: numberFormat(measure) },
        },
        y: {
          aggregate: "count",
          type: "quantitative",
          axis: { title: "Record count" },
        },
        tooltip: [
          {
            field: measure.field,
            type: "quantitative",
            bin: true,
            title: measure.label,
            format: tooltipFormat(measure),
          },
          { aggregate: "count", type: "quantitative", title: "Records" },
        ],
      },
      config,
    },
  });
}

function buildScatterCandidate(fields, data, decision, policy, config) {
  const measures = fieldsWithRole(fields, "measure");
  if (measures.length < 2) return null;
  const [xField, yField] = measures;
  const category = fieldByRole(fields, "dimension");
  return makeCandidate({
    visualId: "relationship.scatter.v1",
    fields: [xField, yField, category],
    signature: `relationship|${xField.field}|${yField.field}|${category?.field || "none"}`,
    title: `${xField.label} versus ${yField.label}`,
    confidence: 0.68 + averageQuality([xField, yField, category]) * 0.25,
    reasons: [
      `${xField.label} and ${yField.label} are separate governed measures.`,
    ],
    dataRows: data,
    decision,
    policy,
    spec: {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      width: "container",
      height: 320,
      data: { values: data },
      mark: { type: "point", filled: true, size: 100, opacity: 0.72 },
      encoding: {
        x: {
          field: xField.field,
          type: "quantitative",
          axis: { title: xField.label, format: numberFormat(xField) },
        },
        y: {
          field: yField.field,
          type: "quantitative",
          axis: { title: yField.label, format: numberFormat(yField) },
        },
        color: category
          ? { field: category.field, type: "nominal", title: category.label }
          : undefined,
        tooltip: [
          {
            field: xField.field,
            type: "quantitative",
            title: xField.label,
            format: tooltipFormat(xField),
          },
          {
            field: yField.field,
            type: "quantitative",
            title: yField.label,
            format: tooltipFormat(yField),
          },
          ...(category
            ? [{ field: category.field, type: "nominal", title: category.label }]
            : []),
        ],
      },
      config,
    },
  });
}

function buildHeatmapCandidate(fields, data, decision, policy, config) {
  const dimensions = fieldsWithRole(fields, "dimension");
  const measure = fieldByRole(fields, "measure");
  if (dimensions.length < 2 || !measure || measure.defaultAggregation === "none") {
    return null;
  }
  const [xField, yField] = dimensions;
  const xCardinality = categoryCardinality(data, xField);
  const yCardinality = categoryCardinality(data, yField);
  if (
    xCardinality > policy.maxHeatmapCardinality ||
    yCardinality > policy.maxHeatmapCardinality
  ) {
    return null;
  }
  return makeCandidate({
    visualId: "relationship.heatmap.v1",
    fields: [xField, yField, measure],
    signature: `heatmap|${xField.field}|${yField.field}|${measure.field}|${measure.defaultAggregation}`,
    title: `${measure.label} by ${xField.label} and ${yField.label}`,
    confidence: 0.65 + averageQuality([xField, yField, measure]) * 0.28,
    reasons: [
      `Both dimensions remain within the ${policy.maxHeatmapCardinality}-category heatmap limit.`,
    ],
    dataRows: data,
    decision,
    policy,
    spec: {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      width: "container",
      height: 320,
      data: { values: data },
      mark: { type: "rect", cornerRadius: 3 },
      encoding: {
        x: {
          field: xField.field,
          type: "nominal",
          axis: { title: xField.label, labelAngle: -35 },
        },
        y: {
          field: yField.field,
          type: "nominal",
          axis: { title: yField.label },
        },
        color: {
          aggregate: measure.defaultAggregation,
          field: measure.field,
          type: "quantitative",
          title: measure.label,
          scale: { scheme: "blues" },
        },
        tooltip: [
          { field: xField.field, type: "nominal", title: xField.label },
          { field: yField.field, type: "nominal", title: yField.label },
          {
            aggregate: measure.defaultAggregation,
            field: measure.field,
            type: "quantitative",
            title: measure.label,
            format: tooltipFormat(measure),
          },
        ],
      },
      config,
    },
  });
}

function aggregateByDimension(data, dimension, measure) {
  const totals = new Map();
  data.forEach((row) => {
    const key = row[dimension.field];
    const value = row[measure.field];
    if (key === null || key === undefined || typeof value !== "number") return;
    totals.set(String(key), (totals.get(String(key)) || 0) + value);
  });
  return [...totals.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function buildTreemapCandidate(fields, data, decision, policy, config) {
  const dimension = fieldByRole(fields, "dimension");
  const measure = fieldByRole(fields, "measure");
  if (!dimension || !measure || measure.defaultAggregation !== "sum") return null;
  const categories = aggregateByDimension(data, dimension, measure);
  if (categories.length < 3 || categories.length > policy.maxCategories) return null;

  const nodes = [
    { id: "root", parent: null, name: "All", value: 0 },
    ...categories.map((item, index) => ({
      id: `node-${index}`,
      parent: "root",
      name: item.name,
      value: item.value,
    })),
  ];

  return makeCandidate({
    visualId: "composition.treemap.v1",
    fields: [dimension, measure],
    signature: `composition|${dimension.field}|${measure.field}|sum`,
    title: `${measure.label} composition by ${dimension.label}`,
    confidence: 0.66 + averageQuality([dimension, measure]) * 0.25,
    reasons: [
      `${measure.label} explicitly permits summation.`,
      `${categories.length} categories are within the treemap complexity limit.`,
    ],
    dataRows: data,
    decision,
    policy,
    spec: {
      $schema: "https://vega.github.io/schema/vega/v5.json",
      width: 720,
      height: 360,
      padding: 5,
      autosize: { type: "fit", contains: "padding" },
      data: [
        {
          name: "tree",
          values: nodes,
          transform: [
            { type: "stratify", key: "id", parentKey: "parent" },
            {
              type: "treemap",
              field: "value",
              sort: { field: "value", order: "descending" },
              round: true,
              method: "squarify",
              ratio: 1.6,
              size: [{ signal: "width" }, { signal: "height" }],
              padding: 2,
            },
          ],
        },
        {
          name: "leaves",
          source: "tree",
          transform: [{ type: "filter", expr: "!datum.children" }],
        },
      ],
      scales: [
        {
          name: "color",
          type: "ordinal",
          domain: { data: "leaves", field: "data.name" },
          range: config.range.category,
        },
      ],
      marks: [
        {
          type: "rect",
          from: { data: "leaves" },
          encode: {
            enter: {
              x: { field: "x0" },
              y: { field: "y0" },
              x2: { field: "x1" },
              y2: { field: "y1" },
              fill: { scale: "color", field: "data.name" },
              stroke: { value: "#ffffff" },
              tooltip: {
                signal: "{Category: datum.data.name, Value: format(datum.data.value, ',.2f')}",
              },
            },
          },
        },
        {
          type: "text",
          from: { data: "leaves" },
          encode: {
            enter: {
              x: { signal: "(datum.x0 + datum.x1) / 2" },
              y: { signal: "(datum.y0 + datum.y1) / 2" },
              align: { value: "center" },
              baseline: { value: "middle" },
              fill: { value: "#ffffff" },
              fontWeight: { value: 600 },
              fontSize: { value: 11 },
              text: {
                signal: "datum.x1 - datum.x0 > 70 && datum.y1 - datum.y0 > 34 ? datum.data.name : ''",
              },
              limit: { signal: "max(0, datum.x1 - datum.x0 - 8)" },
            },
          },
        },
      ],
      config,
    },
  });
}

function aggregateFlows(data, sourceField, targetField, weightField) {
  const links = new Map();
  data.forEach((row) => {
    const source = row[sourceField.field];
    const target = row[targetField.field];
    const weight = row[weightField.field];
    if (
      source === null ||
      source === undefined ||
      target === null ||
      target === undefined ||
      typeof weight !== "number" ||
      !Number.isFinite(weight) ||
      weight <= 0
    ) {
      return;
    }
    const key = `${String(source)}\u0000${String(target)}`;
    const existing = links.get(key) || {
      source: String(source),
      target: String(target),
      value: 0,
    };
    existing.value += weight;
    links.set(key, existing);
  });
  return [...links.values()].sort(
    (a, b) => b.value - a.value ||
      a.source.localeCompare(b.source) ||
      a.target.localeCompare(b.target),
  );
}

function buildSankeyGeometry(flows, width = 760, height = 440) {
  const leftX = 24;
  const nodeWidth = 18;
  const rightX = width - 42;
  const gap = 8;
  const sourceTotals = new Map();
  const targetTotals = new Map();

  flows.forEach((flow) => {
    sourceTotals.set(flow.source, (sourceTotals.get(flow.source) || 0) + flow.value);
    targetTotals.set(flow.target, (targetTotals.get(flow.target) || 0) + flow.value);
  });

  const makeNodes = (totals, side) => {
    const sorted = [...totals.entries()].sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
    );
    const totalValue = sorted.reduce((sum, [, value]) => sum + value, 0);
    const available = height - gap * Math.max(0, sorted.length - 1);
    let cursor = 0;
    return sorted.map(([name, value]) => {
      const nodeHeight = Math.max(8, available * (value / totalValue));
      const node = {
        id: `${side}:${name}`,
        name,
        side,
        value,
        x0: side === "source" ? leftX : rightX,
        x1: side === "source" ? leftX + nodeWidth : rightX + nodeWidth,
        y0: cursor,
        y1: Math.min(height, cursor + nodeHeight),
      };
      cursor += nodeHeight + gap;
      return node;
    });
  };

  const sourceNodes = makeNodes(sourceTotals, "source");
  const targetNodes = makeNodes(targetTotals, "target");
  const sourceIndex = new Map(sourceNodes.map((node) => [node.name, node]));
  const targetIndex = new Map(targetNodes.map((node) => [node.name, node]));
  const sourceOffsets = new Map(sourceNodes.map((node) => [node.name, node.y0]));
  const targetOffsets = new Map(targetNodes.map((node) => [node.name, node.y0]));

  const maxFlow = Math.max(...flows.map((flow) => flow.value));
  const minFlow = Math.min(...flows.map((flow) => flow.value));
  const thickness = (value) => {
    if (maxFlow === minFlow) return 14;
    return 3 + ((value - minFlow) / (maxFlow - minFlow)) * 19;
  };

  const links = flows.map((flow, index) => {
    const sourceNode = sourceIndex.get(flow.source);
    const targetNode = targetIndex.get(flow.target);
    const sourceScale =
      (sourceNode.y1 - sourceNode.y0) / sourceNode.value;
    const targetScale =
      (targetNode.y1 - targetNode.y0) / targetNode.value;
    const sourceY =
      (sourceOffsets.get(flow.source) || sourceNode.y0) +
      (flow.value * sourceScale) / 2;
    const targetY =
      (targetOffsets.get(flow.target) || targetNode.y0) +
      (flow.value * targetScale) / 2;
    sourceOffsets.set(
      flow.source,
      (sourceOffsets.get(flow.source) || sourceNode.y0) +
        flow.value * sourceScale,
    );
    targetOffsets.set(
      flow.target,
      (targetOffsets.get(flow.target) || targetNode.y0) +
        flow.value * targetScale,
    );
    const startX = sourceNode.x1;
    const endX = targetNode.x0;
    const control = (endX - startX) * 0.5;
    return {
      id: `link-${index}`,
      source: flow.source,
      target: flow.target,
      value: flow.value,
      strokeWidth: thickness(flow.value),
      path: `M${startX},${sourceY} C${startX + control},${sourceY} ${endX - control},${targetY} ${endX},${targetY}`,
    };
  });

  return { nodes: [...sourceNodes, ...targetNodes], links, width, height };
}

function buildSankeyCandidate(fields, data, decision, policy, config) {
  const source = fieldByRole(fields, "source");
  const target = fieldByRole(fields, "target");
  const weight = fieldByRole(fields, "weight");
  if (!source || !target || !weight) return null;
  if (!["sum", "none"].includes(weight.defaultAggregation)) return null;

  const flows = aggregateFlows(data, source, target, weight);
  const nodeCount = new Set(
    flows.flatMap((flow) => [flow.source, flow.target]),
  ).size;
  if (
    flows.length < 1 ||
    flows.length > policy.maxSankeyLinks ||
    nodeCount > policy.maxSankeyNodes
  ) {
    return null;
  }

  const invalidRows = data.length - flows.length;
  const geometry = buildSankeyGeometry(flows);
  const warning =
    invalidRows > 0
      ? [
          "Rows with missing, non-finite, zero, or negative flow weights were excluded.",
        ]
      : [];

  return makeCandidate({
    visualId: "flow.sankey.v1",
    fields: [source, target, weight],
    signature: `flow|${source.field}|${target.field}|${weight.field}`,
    title: `${weight.label} flow from ${source.label} to ${target.label}`,
    confidence:
      0.74 +
      averageQuality([source, target, weight]) * 0.2 -
      Math.min(0.2, invalidRows / Math.max(1, data.length)),
    reasons: [
      "The decision intent requests a flow or transition view.",
      "Explicit source, target, and positive weight roles are present.",
      `${nodeCount} nodes and ${flows.length} links are within governed limits.`,
    ],
    warnings: warning,
    dataRows: data,
    decision,
    policy,
    spec: {
      $schema: "https://vega.github.io/schema/vega/v5.json",
      width: geometry.width,
      height: geometry.height,
      padding: 8,
      autosize: { type: "fit", contains: "padding" },
      data: [
        { name: "links", values: geometry.links },
        { name: "nodes", values: geometry.nodes },
      ],
      scales: [
        {
          name: "nodeColor",
          type: "ordinal",
          domain: ["source", "target"],
          range: config.range.category.slice(0, 2),
        },
      ],
      marks: [
        {
          type: "path",
          from: { data: "links" },
          encode: {
            enter: {
              path: { field: "path" },
              stroke: { value: "#64748b" },
              strokeOpacity: { value: 0.38 },
              strokeWidth: { field: "strokeWidth" },
              fill: { value: null },
              tooltip: {
                signal:
                  "{Source: datum.source, Target: datum.target, Value: format(datum.value, ',.2f')}",
              },
            },
            update: { strokeOpacity: { value: 0.38 } },
            hover: { strokeOpacity: { value: 0.82 } },
          },
        },
        {
          type: "rect",
          from: { data: "nodes" },
          encode: {
            enter: {
              x: { field: "x0" },
              x2: { field: "x1" },
              y: { field: "y0" },
              y2: { field: "y1" },
              fill: { scale: "nodeColor", field: "side" },
              cornerRadius: { value: 3 },
              tooltip: {
                signal:
                  "{Node: datum.name, Side: datum.side, Value: format(datum.value, ',.2f')}",
              },
            },
          },
        },
        {
          type: "text",
          from: { data: "nodes" },
          encode: {
            enter: {
              x: {
                signal: "datum.side === 'source' ? datum.x1 + 6 : datum.x0 - 6",
              },
              y: { signal: "(datum.y0 + datum.y1) / 2" },
              align: {
                signal: "datum.side === 'source' ? 'left' : 'right'",
              },
              baseline: { value: "middle" },
              fill: { value: "#334155" },
              fontSize: { value: 11 },
              fontWeight: { value: 600 },
              text: { field: "name" },
              limit: { value: 220 },
            },
          },
        },
      ],
      config,
    },
  });
}

function buildMapCandidate(fields, data, decision, policy, config) {
  const latitude = fieldByRole(fields, "latitude");
  const longitude = fieldByRole(fields, "longitude");
  if (!latitude || !longitude) return null;
  const measure = fieldByRole(fields, "measure");
  const dimension = fieldByRole(fields, "dimension");
  const validRows = data.filter((row) => {
    const lat = row[latitude.field];
    const lon = row[longitude.field];
    return (
      typeof lat === "number" &&
      Number.isFinite(lat) &&
      lat >= -90 &&
      lat <= 90 &&
      typeof lon === "number" &&
      Number.isFinite(lon) &&
      lon >= -180 &&
      lon <= 180
    );
  });
  if (!validRows.length || validRows.length > policy.maxMapPoints) return null;
  const coverage = validRows.length / data.length;
  const encodings = {
    longitude: {
      field: longitude.field,
      type: "quantitative",
      title: longitude.label,
    },
    latitude: {
      field: latitude.field,
      type: "quantitative",
      title: latitude.label,
    },
    tooltip: [
      {
        field: latitude.field,
        type: "quantitative",
        title: latitude.label,
        format: ".4f",
      },
      {
        field: longitude.field,
        type: "quantitative",
        title: longitude.label,
        format: ".4f",
      },
      ...(dimension
        ? [{ field: dimension.field, type: "nominal", title: dimension.label }]
        : []),
      ...(measure
        ? [
            {
              field: measure.field,
              type: "quantitative",
              title: measure.label,
              format: tooltipFormat(measure),
            },
          ]
        : []),
    ],
  };
  if (dimension && categoryCardinality(validRows, dimension) <= 12) {
    encodings.color = {
      field: dimension.field,
      type: "nominal",
      title: dimension.label,
    };
  }
  if (measure) {
    encodings.size = {
      field: measure.field,
      type: "quantitative",
      title: measure.label,
      scale: { range: [35, 650] },
    };
  }

  return makeCandidate({
    visualId: "geo.point-map.v1",
    fields: [latitude, longitude, measure, dimension],
    signature: `geo|${latitude.field}|${longitude.field}|${measure?.field || "none"}|${dimension?.field || "none"}`,
    title: dimension
      ? `${dimension.label} locations`
      : "Geographic distribution",
    confidence:
      0.7 +
      averageQuality([latitude, longitude, measure, dimension]) * 0.2 +
      coverage * 0.08,
    reasons: [
      "Explicit latitude and longitude semantic roles are present.",
      `${validRows.length} points are within the ${policy.maxMapPoints}-point limit.`,
    ],
    warnings:
      coverage < 1
        ? [`${data.length - validRows.length} rows with invalid coordinates were excluded.`]
        : [],
    dataRows: validRows,
    decision,
    policy,
    spec: {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      width: "container",
      height: 420,
      projection: { type: "equalEarth" },
      layer: [
        {
          data: { sphere: true },
          mark: {
            type: "geoshape",
            fill: "#f8fafc",
            stroke: "#94a3b8",
          },
        },
        {
          data: { graticule: { step: [20, 20] } },
          mark: {
            type: "geoshape",
            fill: null,
            stroke: "#cbd5e1",
            strokeWidth: 0.5,
          },
        },
        {
          data: { values: validRows },
          mark: {
            type: "circle",
            opacity: 0.78,
            stroke: "#ffffff",
            strokeWidth: 0.8,
          },
          encoding: encodings,
        },
      ],
      config,
    },
  });
}

function selectCandidates(candidates, policy, decision) {
  const eligible = candidates
    .filter(Boolean)
    .filter((candidate) => visualAllowed(candidate.visualId, policy))
    .filter((candidate) => candidate.confidence >= policy.minimumConfidence)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.confidence - a.confidence ||
        a.visualId.localeCompare(b.visualId),
    );

  const selected = [];
  const familyCounts = new Map();
  const signatures = new Set();

  for (const candidate of eligible) {
    if (selected.length >= policy.maxCharts) break;
    if (signatures.has(candidate.signature)) continue;
    const familyCount = familyCounts.get(candidate.family) || 0;
    if (familyCount >= policy.maxPerFamily) continue;

    selected.push(candidate);
    signatures.add(candidate.signature);
    familyCounts.set(candidate.family, familyCount + 1);
  }

  if (
    decision.preferredVisualId &&
    !selected.some((candidate) => candidate.visualId === decision.preferredVisualId)
  ) {
    const preferred = eligible.find(
      (candidate) => candidate.visualId === decision.preferredVisualId,
    );
    if (preferred) {
      const conflictIndex = selected.findIndex(
        (candidate) =>
          candidate.family === preferred.family ||
          candidate.signature === preferred.signature,
      );
      if (conflictIndex >= 0) selected.splice(conflictIndex, 1, preferred);
      else if (selected.length < policy.maxCharts) selected.unshift(preferred);
    }
  }

  return { eligible, selected };
}

function buildDesktopSpec(selected, data, config) {
  const trend = selected.find((item) => item.visualId === "trend.line.v1");
  const comparison = selected.find((item) =>
    ["comparison.bar.v1", "comparison.dot.v1"].includes(item.visualId),
  );
  const relationship = selected.find(
    (item) => item.visualId === "relationship.scatter.v1",
  );
  if (!trend || !comparison || !relationship) return null;

  const trendSpec = clone(trend.spec);
  const comparisonSpec = clone(comparison.spec);
  const relationshipSpec = clone(relationship.spec);
  [trendSpec, comparisonSpec, relationshipSpec].forEach((spec) => {
    delete spec.$schema;
    delete spec.data;
    delete spec.config;
    delete spec.width;
    spec.height = 250;
  });

  const comparisonField =
    comparisonSpec.encoding?.y?.field || comparisonSpec.encoding?.x?.field;
  if (comparisonField) {
    comparisonSpec.params = [
      {
        name: "comparison_select",
        select: {
          type: "point",
          fields: [comparisonField],
          toggle: true,
          clear: "dblclick",
        },
      },
    ];
    trendSpec.transform = [{ filter: { param: "comparison_select" } }];
    relationshipSpec.encoding.opacity = {
      condition: { param: "comparison_select", value: 1 },
      value: 0.15,
    };
  }

  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    data: { values: data },
    config: { ...config, concat: { spacing: 34 } },
    vconcat: [
      { ...trendSpec, width: 760, title: trend.title },
      {
        hconcat: [
          { ...comparisonSpec, width: 360, title: comparison.title },
          { ...relationshipSpec, width: 360, title: relationship.title },
        ],
      },
    ],
  };
}

export function recommendDashboard(profiles, data, themeConfig = {}) {
  const context = parseContext(data);
  const decision = {
    intent: context.decision?.intent || "overview",
    question: context.decision?.question || null,
    preferredVisualId:
      context.decision?.preferredVisualId ||
      context.presentation?.visualId ||
      null,
  };
  const policy = normalizePolicy(context.visualPolicy);
  const fields = normalizeSemanticFields(
    context.semanticModel,
    data,
    profiles || {},
  );
  const config = premiumConfig(policy, themeConfig);

  const candidates = [
    buildTrendCandidate(fields, data, decision, policy, config),
    ...buildComparisonCandidates(fields, data, decision, policy, config),
    buildHistogramCandidate(fields, data, decision, policy, config),
    buildScatterCandidate(fields, data, decision, policy, config),
    buildHeatmapCandidate(fields, data, decision, policy, config),
    buildTreemapCandidate(fields, data, decision, policy, config),
    buildSankeyCandidate(fields, data, decision, policy, config),
    buildMapCandidate(fields, data, decision, policy, config),
  ].filter(Boolean);

  const { eligible, selected } = selectCandidates(
    candidates,
    policy,
    decision,
  );
  const tableField =
    fieldByRole(fields, "measure") || fieldByRole(fields, "time");
  const tableData = tableField
    ? [...data]
        .sort((a, b) => {
          const left = a[tableField.field];
          const right = b[tableField.field];
          if (typeof left === "number" && typeof right === "number") {
            return right - left;
          }
          return String(left ?? "").localeCompare(String(right ?? ""));
        })
        .slice(0, 100)
    : data.slice(0, 100);

  const dashboard = {
    registryVersion: VISUAL_REGISTRY_VERSION,
    kpis: buildKpis(fields, data),
    charts: selected,
    tableData: policy.requireTableFallback ? tableData : [],
    desktopSpec: buildDesktopSpec(selected, data, config),
    selectionAudit: {
      registryVersion: VISUAL_REGISTRY_VERSION,
      intent: decision.intent,
      question: decision.question,
      preferredVisualId: decision.preferredVisualId,
      selectedVisualIds: selected.map((item) => item.visualId),
      rejectedVisualIds: eligible
        .filter((item) => !selected.includes(item))
        .map((item) => item.visualId),
      candidateScores: candidates.map((candidate) => ({
        visualId: candidate.visualId,
        family: candidate.family,
        score: candidate.score,
        confidence: candidate.confidence,
        signature: candidate.signature,
        reasons: candidate.reasons,
        warnings: candidate.warnings,
      })),
      policy: {
        maxCharts: policy.maxCharts,
        maxPerFamily: policy.maxPerFamily,
        minimumConfidence: policy.minimumConfidence,
        requireTableFallback: policy.requireTableFallback,
        accessibilityMode: policy.accessibilityMode,
        allowCustomSpec: policy.allowCustomSpec,
      },
      safeguards: [
        "approved-registry-only",
        "semantic-field-roles",
        "aggregation-allowlist",
        "duplicate-signature-rejection",
        "visual-family-limit",
        "recent-visual-penalty",
        "minimum-confidence-threshold",
        "complexity-limits",
        "accessible-table-fallback",
      ],
    },
  };

  if (context && typeof context === "object") {
    context.selectionAudit = dashboard.selectionAudit;
  }

  return dashboard;
}

export { APPROVED_VISUAL_IDS, VISUAL_REGISTRY, VISUAL_REGISTRY_VERSION };
