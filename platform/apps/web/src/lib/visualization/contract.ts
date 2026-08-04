import { z } from "zod";

export const ANALYTICS_FACTS_CONTRACT_VERSION =
  "fedpulse.analytics.facts.v2" as const;
export const VISUAL_REGISTRY_VERSION =
  "fedpulse.visual-registry.v1" as const;

export const APPROVED_VISUAL_IDS = [
  "trend.line.v1",
  "comparison.bar.v1",
  "comparison.dot.v1",
  "distribution.histogram.v1",
  "relationship.scatter.v1",
  "relationship.heatmap.v1",
  "composition.treemap.v1",
  "flow.sankey.v1",
  "geo.point-map.v1",
  "table.detail.v1",
] as const;

export const factScalarSchema = z.union([
  z.string(),
  z.number().finite(),
  z.boolean(),
  z.null(),
]);

export const factRowSchema = z.record(
  z.string().min(1).max(100),
  factScalarSchema,
);

export const approvedVisualIdSchema = z.enum(APPROVED_VISUAL_IDS);

export const analyticsProvenanceSchema = z
  .object({
    sourceSystem: z.string().min(1).max(100),
    sourceUrl: z
      .string()
      .url()
      .refine(
        (value) =>
          value.startsWith("http://") || value.startsWith("https://"),
        { message: "sourceUrl must use HTTP or HTTPS" },
      )
      .nullish(),
    productVersion: z.string().min(1).max(100),
    coverageThrough: z.string().date(),
    generatedAt: z.string().datetime({ offset: true }),
    datasetHash: z.string().min(8).max(160).nullish(),
    requestId: z.string().min(1).max(120).nullish(),
    evidenceIds: z.array(z.string().min(1).max(160)).max(100).default([]),
    limitations: z.array(z.string().min(1).max(500)).max(20).default([]),
  })
  .strict();

export const analyticsStatusSchema = z
  .object({
    state: z.enum(["ready", "partial", "empty", "error"]),
    message: z.string().min(1).max(300).nullish(),
  })
  .strict();

export const analyticsIntentSchema = z.enum([
  "overview",
  "trend",
  "comparison",
  "ranking",
  "distribution",
  "relationship",
  "composition",
  "concentration",
  "flow",
  "transition",
  "allocation",
  "geography",
  "regional-comparison",
  "location",
]);

export const analyticsDecisionSchema = z
  .object({
    intent: analyticsIntentSchema,
    question: z.string().min(1).max(600).nullish(),
    audienceRole: z.string().min(1).max(100).nullish(),
    preferredVisualId: approvedVisualIdSchema.nullish(),
  })
  .strict();

export const semanticFieldRoleSchema = z.enum([
  "measure",
  "dimension",
  "time",
  "identifier",
  "source",
  "target",
  "weight",
  "latitude",
  "longitude",
  "geography",
  "stage",
]);

export const semanticTypeSchema = z.enum([
  "currency",
  "number",
  "percentage",
  "count",
  "duration",
  "date",
  "datetime",
  "category",
  "identifier",
  "organization",
  "supplier",
  "department",
  "latitude",
  "longitude",
  "region",
  "country",
  "flow-node",
  "flow-weight",
  "text",
]);

export const aggregationSchema = z.enum([
  "sum",
  "mean",
  "median",
  "min",
  "max",
  "count",
  "distinct_count",
  "none",
]);

export const semanticFieldQualitySchema = z
  .object({
    coverage: z.number().min(0).max(1),
    confidence: z.number().min(0).max(1),
  })
  .strict();

export const semanticFieldSchema = z
  .object({
    field: z.string().min(1).max(100),
    label: z.string().min(1).max(160),
    roles: z
      .array(semanticFieldRoleSchema)
      .min(1)
      .max(4)
      .refine((roles) => new Set(roles).size === roles.length, {
        message: "semantic field roles must be unique",
      }),
    semanticType: semanticTypeSchema,
    defaultAggregation: aggregationSchema,
    allowedAggregations: z
      .array(aggregationSchema)
      .min(1)
      .max(8)
      .refine(
        (aggregations) =>
          new Set(aggregations).size === aggregations.length,
        { message: "allowed aggregations must be unique" },
      ),
    currency: z.string().regex(/^[A-Z]{3}$/).nullish(),
    unit: z.string().min(1).max(40).nullish(),
    priority: z.number().int().min(0).max(100).default(50),
    hierarchy: z.array(z.string().min(1).max(100)).max(10).default([]),
    sensitivity: z
      .enum(["public", "internal", "commercial", "restricted"])
      .default("internal"),
    quality: semanticFieldQualitySchema,
  })
  .strict()
  .superRefine((field, context) => {
    if (!field.allowedAggregations.includes(field.defaultAggregation)) {
      context.addIssue({
        code: "custom",
        path: ["defaultAggregation"],
        message: "default aggregation must be in allowed aggregations",
      });
    }

    const isMeasure =
      field.roles.includes("measure") || field.roles.includes("weight");
    if (!isMeasure && field.defaultAggregation !== "none") {
      context.addIssue({
        code: "custom",
        path: ["defaultAggregation"],
        message: "non-measure fields must use none aggregation",
      });
    }

    if (field.semanticType === "currency" && !field.currency) {
      context.addIssue({
        code: "custom",
        path: ["currency"],
        message: "currency semantic fields require an ISO currency code",
      });
    }

    if (
      field.roles.includes("latitude") &&
      field.semanticType !== "latitude"
    ) {
      context.addIssue({
        code: "custom",
        path: ["semanticType"],
        message: "latitude role requires latitude semantic type",
      });
    }

    if (
      field.roles.includes("longitude") &&
      field.semanticType !== "longitude"
    ) {
      context.addIssue({
        code: "custom",
        path: ["semanticType"],
        message: "longitude role requires longitude semantic type",
      });
    }
  });

export const semanticModelSchema = z
  .object({
    registryVersion: z.literal(VISUAL_REGISTRY_VERSION),
    fields: z
      .array(semanticFieldSchema)
      .min(1)
      .max(100)
      .refine(
        (fields) =>
          new Set(fields.map((field) => field.field)).size === fields.length,
        { message: "semantic field names must be unique" },
      ),
  })
  .strict();

export const analyticsVisualPolicySchema = z
  .object({
    maxCharts: z.number().int().min(1).max(8).default(4),
    maxPerFamily: z.number().int().min(1).max(4).default(1),
    minimumConfidence: z.number().min(0).max(1).default(0.62),
    recentVisualIds: z.array(approvedVisualIdSchema).max(50).default([]),
    allowedVisualIds: z.array(approvedVisualIdSchema).max(20).default([]),
    deniedVisualIds: z.array(approvedVisualIdSchema).max(20).default([]),
    diversityWeight: z.number().min(0).max(2).default(1),
    requireTableFallback: z.boolean().default(true),
    allowCustomSpec: z.boolean().default(false),
    accessibilityMode: z
      .enum(["standard", "high-contrast"])
      .default("standard"),
    maxCategories: z.number().int().min(2).max(100).default(30),
    maxHeatmapCardinality: z.number().int().min(2).max(30).default(12),
    maxSankeyNodes: z.number().int().min(2).max(100).default(40),
    maxSankeyLinks: z.number().int().min(1).max(500).default(150),
    maxMapPoints: z.number().int().min(1).max(10_000).default(2000),
  })
  .strict()
  .superRefine((policy, context) => {
    if (policy.maxPerFamily > policy.maxCharts) {
      context.addIssue({
        code: "custom",
        path: ["maxPerFamily"],
        message: "maxPerFamily cannot exceed maxCharts",
      });
    }

    const overlap = policy.allowedVisualIds.filter((visualId) =>
      policy.deniedVisualIds.includes(visualId),
    );
    if (overlap.length) {
      context.addIssue({
        code: "custom",
        path: ["deniedVisualIds"],
        message: `visuals cannot be both allowed and denied: ${overlap.join(", ")}`,
      });
    }
  });

export const chartLayoutItemSchema = z
  .object({
    id: approvedVisualIdSchema,
    span: z.number().int().min(1).max(12),
  })
  .strict();

export const analyticsPresentationSchema = z
  .object({
    theme: z.enum(["auto", "light", "dark"]).default("auto"),
    layoutMode: z.enum(["auto", "canvas", "grid"]).default("auto"),
    approvalMode: z.boolean().default(false),
    visualId: approvedVisualIdSchema.nullish(),
    chartConfig: z.record(z.string(), z.unknown()).nullish(),
    chartLayout: z.array(chartLayoutItemSchema).max(30).nullish(),
    spec: z.record(z.string(), z.unknown()).nullish(),
  })
  .strict()
  .default({
    theme: "auto",
    layoutMode: "auto",
    approvalMode: false,
    visualId: null,
    chartConfig: null,
    chartLayout: null,
    spec: null,
  });

export const analyticsFactsSchema = z
  .object({
    contractVersion: z.literal(ANALYTICS_FACTS_CONTRACT_VERSION),
    datasetId: z.string().regex(/^[a-z0-9][a-z0-9._-]{2,119}$/),
    title: z.string().min(1).max(160),
    description: z.string().min(1).max(600).nullish(),
    status: analyticsStatusSchema,
    provenance: analyticsProvenanceSchema,
    decision: analyticsDecisionSchema,
    semanticModel: semanticModelSchema,
    visualPolicy: analyticsVisualPolicySchema,
    presentation: analyticsPresentationSchema,
    facts: z.array(factRowSchema).max(10_000),
  })
  .strict()
  .superRefine((payload, context) => {
    const hasFacts = payload.facts.length > 0;

    if (["ready", "partial"].includes(payload.status.state) && !hasFacts) {
      context.addIssue({
        code: "custom",
        path: ["facts"],
        message: `${payload.status.state} analytics require at least one fact row`,
      });
    }

    if (["empty", "error"].includes(payload.status.state) && hasFacts) {
      context.addIssue({
        code: "custom",
        path: ["facts"],
        message: `${payload.status.state} analytics must not include fact rows`,
      });
    }

    if (payload.presentation.spec && !payload.visualPolicy.allowCustomSpec) {
      context.addIssue({
        code: "custom",
        path: ["presentation", "spec"],
        message: "custom specifications require allowCustomSpec=true",
      });
    }

    if (!hasFacts) return;

    const firstKeys = Object.keys(payload.facts[0]).sort();
    if (firstKeys.length === 0) {
      context.addIssue({
        code: "custom",
        path: ["facts", 0],
        message: "fact rows must contain at least one field",
      });
      return;
    }

    payload.facts.forEach((row, rowIndex) => {
      const rowKeys = Object.keys(row).sort();
      if (
        rowKeys.length !== firstKeys.length ||
        rowKeys.some((key, index) => key !== firstKeys[index])
      ) {
        context.addIssue({
          code: "custom",
          path: ["facts", rowIndex],
          message: "all fact rows must expose the same fields",
        });
      }
    });

    const semanticKeys = payload.semanticModel.fields
      .map((field) => field.field)
      .sort();
    if (
      semanticKeys.length !== firstKeys.length ||
      semanticKeys.some((key, index) => key !== firstKeys[index])
    ) {
      context.addIssue({
        code: "custom",
        path: ["semanticModel", "fields"],
        message: "semantic model must describe every fact field exactly once",
      });
    }

    const sourceCount = payload.semanticModel.fields.filter((field) =>
      field.roles.includes("source"),
    ).length;
    const targetCount = payload.semanticModel.fields.filter((field) =>
      field.roles.includes("target"),
    ).length;
    const weightCount = payload.semanticModel.fields.filter((field) =>
      field.roles.includes("weight"),
    ).length;
    if (
      ["flow", "transition", "allocation"].includes(payload.decision.intent) &&
      (sourceCount !== 1 || targetCount !== 1 || weightCount !== 1)
    ) {
      context.addIssue({
        code: "custom",
        path: ["semanticModel", "fields"],
        message:
          "flow decisions require exactly one source, target, and weight field",
      });
    }

    const latitudeCount = payload.semanticModel.fields.filter((field) =>
      field.roles.includes("latitude"),
    ).length;
    const longitudeCount = payload.semanticModel.fields.filter((field) =>
      field.roles.includes("longitude"),
    ).length;
    if (
      ["geography", "regional-comparison", "location"].includes(
        payload.decision.intent,
      ) &&
      (latitudeCount !== 1 || longitudeCount !== 1)
    ) {
      context.addIssue({
        code: "custom",
        path: ["semanticModel", "fields"],
        message:
          "geographic decisions require exactly one latitude and longitude field",
      });
    }
  });

export type ApprovedVisualId = z.infer<typeof approvedVisualIdSchema>;
export type FactScalar = z.infer<typeof factScalarSchema>;
export type FactRow = z.infer<typeof factRowSchema>;
export type AnalyticsProvenance = z.infer<typeof analyticsProvenanceSchema>;
export type AnalyticsDecision = z.infer<typeof analyticsDecisionSchema>;
export type SemanticField = z.infer<typeof semanticFieldSchema>;
export type SemanticModel = z.infer<typeof semanticModelSchema>;
export type AnalyticsVisualPolicy = z.infer<
  typeof analyticsVisualPolicySchema
>;
export type AnalyticsPresentation = z.infer<
  typeof analyticsPresentationSchema
>;
export type AnalyticsFacts = z.infer<typeof analyticsFactsSchema>;

export function parseAnalyticsFacts(input: unknown): AnalyticsFacts {
  return analyticsFactsSchema.parse(input);
}

export function safeParseAnalyticsFacts(input: unknown) {
  return analyticsFactsSchema.safeParse(input);
}
