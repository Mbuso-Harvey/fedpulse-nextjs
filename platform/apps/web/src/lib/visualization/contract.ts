import { z } from "zod";

export const ANALYTICS_FACTS_CONTRACT_VERSION =
  "fedpulse.analytics.facts.v1" as const;

export const factScalarSchema = z.union([
  z.string(),
  z.number().finite(),
  z.boolean(),
  z.null(),
]);

export const factRowSchema = z.record(z.string().min(1).max(100), factScalarSchema);

export const analyticsProvenanceSchema = z
  .object({
    sourceSystem: z.string().min(1).max(100),
    sourceUrl: z
      .string()
      .url()
      .refine((value) => value.startsWith("http://") || value.startsWith("https://"), {
        message: "sourceUrl must use HTTP or HTTPS",
      })
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

export const chartLayoutItemSchema = z
  .object({
    id: z.string().min(1).max(100),
    span: z.number().int().min(1).max(12),
  })
  .strict();

export const analyticsPresentationSchema = z
  .object({
    theme: z.enum(["auto", "light", "dark"]).default("auto"),
    layoutMode: z.enum(["auto", "canvas", "grid"]).default("auto"),
    approvalMode: z.boolean().default(false),
    chartConfig: z.record(z.string(), z.unknown()).nullish(),
    chartLayout: z.array(chartLayoutItemSchema).max(30).nullish(),
    spec: z.record(z.string(), z.unknown()).nullish(),
  })
  .strict()
  .default({
    theme: "auto",
    layoutMode: "auto",
    approvalMode: false,
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
  });

export type FactScalar = z.infer<typeof factScalarSchema>;
export type FactRow = z.infer<typeof factRowSchema>;
export type AnalyticsProvenance = z.infer<typeof analyticsProvenanceSchema>;
export type AnalyticsPresentation = z.infer<typeof analyticsPresentationSchema>;
export type AnalyticsFacts = z.infer<typeof analyticsFactsSchema>;

export function parseAnalyticsFacts(input: unknown): AnalyticsFacts {
  return analyticsFactsSchema.parse(input);
}

export function safeParseAnalyticsFacts(input: unknown) {
  return analyticsFactsSchema.safeParse(input);
}
