import { z } from "zod";

export const VISUALIZATION_CONTRACT_VERSION = "fedpulse.visualization.v1" as const;

export const scalarSchema = z.union([
  z.string(),
  z.number().finite(),
  z.boolean(),
  z.null(),
]);

export const valueFormatSchema = z
  .object({
    style: z.enum(["text", "number", "currency", "percent", "date"]),
    notation: z.enum(["standard", "compact"]).default("standard"),
    decimals: z.number().int().min(0).max(4).default(0),
    currency: z.string().regex(/^[A-Z]{3}$/).optional(),
    percentScale: z.enum(["points", "fraction"]).default("points"),
    prefix: z.string().max(12).optional(),
    suffix: z.string().max(12).optional(),
  })
  .strict()
  .superRefine((format, context) => {
    if (format.style === "currency" && !format.currency) {
      context.addIssue({
        code: "custom",
        path: ["currency"],
        message: "currency is required when style is currency",
      });
    }
  });

export const provenanceSchema = z
  .object({
    sourceSystem: z.string().min(1).max(100),
    sourceUrl: z.string().url().optional(),
    productVersion: z.string().min(1).max(100),
    coverageThrough: z.string().date(),
    generatedAt: z.string().datetime({ offset: true }),
    datasetHash: z.string().min(8).max(160).optional(),
    requestId: z.string().min(1).max(120).optional(),
    evidenceIds: z.array(z.string().min(1).max(160)).max(100).default([]),
    limitations: z.array(z.string().min(1).max(500)).max(20).default([]),
  })
  .strict();

export const widgetStatusSchema = z
  .object({
    state: z.enum(["ready", "partial", "empty", "error"]),
    message: z.string().min(1).max(300).optional(),
  })
  .strict();

const baseWidgetShape = {
  contractVersion: z.literal(VISUALIZATION_CONTRACT_VERSION),
  widgetId: z.string().regex(/^[a-z0-9][a-z0-9._-]{2,99}$/),
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(500).optional(),
  status: widgetStatusSchema,
  provenance: provenanceSchema,
};

export const metricWidgetSchema = z
  .object({
    ...baseWidgetShape,
    kind: z.literal("metric"),
    metric: z
      .object({
        label: z.string().min(1).max(100).optional(),
        value: scalarSchema,
        format: valueFormatSchema.optional(),
        context: z.string().min(1).max(240).optional(),
        trendLabel: z.string().min(1).max(120).optional(),
      })
      .strict(),
  })
  .strict();

export const chartSeriesSchema = z
  .object({
    dataKey: z.string().min(1).max(80),
    label: z.string().min(1).max(100),
    format: valueFormatSchema.optional(),
  })
  .strict();

export const chartWidgetSchema = z
  .object({
    ...baseWidgetShape,
    kind: z.literal("chart"),
    chart: z
      .object({
        type: z.enum(["bar", "line", "pie", "scatter"]),
        xKey: z.string().min(1).max(80),
        xLabel: z.string().min(1).max(100).optional(),
        yLabel: z.string().min(1).max(100).optional(),
        barDirection: z.enum(["columns", "rows"]).default("columns"),
        showLegend: z.boolean().default(true),
        stacked: z.boolean().default(false),
        series: z.array(chartSeriesSchema).min(1).max(5),
      })
      .strict(),
    data: z.array(z.record(z.string(), scalarSchema)).max(500),
  })
  .strict();

export const tableColumnSchema = z
  .object({
    key: z.string().min(1).max(80),
    label: z.string().min(1).max(100),
    align: z.enum(["left", "center", "right"]).default("left"),
    format: valueFormatSchema.optional(),
  })
  .strict();

export const tableWidgetSchema = z
  .object({
    ...baseWidgetShape,
    kind: z.literal("table"),
    table: z
      .object({
        columns: z.array(tableColumnSchema).min(1).max(20),
        rows: z.array(z.record(z.string(), scalarSchema)).max(1000),
        rowKey: z.string().min(1).max(80).optional(),
      })
      .strict(),
  })
  .strict();

export const insightItemSchema = z
  .object({
    id: z.string().min(1).max(100),
    title: z.string().min(1).max(140),
    summary: z.string().min(1).max(800),
    severity: z.enum(["info", "opportunity", "watch", "risk"]),
    evidenceIds: z.array(z.string().min(1).max(160)).max(30).default([]),
  })
  .strict();

export const insightListWidgetSchema = z
  .object({
    ...baseWidgetShape,
    kind: z.literal("insight_list"),
    insights: z.array(insightItemSchema).max(20),
  })
  .strict();

const analyticsWidgetUnionSchema = z.discriminatedUnion("kind", [
  metricWidgetSchema,
  chartWidgetSchema,
  tableWidgetSchema,
  insightListWidgetSchema,
]);

export const analyticsWidgetSchema = analyticsWidgetUnionSchema.superRefine(
  (widget, context) => {
    if (widget.kind !== "chart") return;

    const { chart, data } = widget;
    const keys = [chart.xKey, ...chart.series.map((series) => series.dataKey)];

    if (chart.type === "pie" && chart.series.length !== 1) {
      context.addIssue({
        code: "custom",
        path: ["chart", "series"],
        message: "pie charts require exactly one series",
      });
    }

    if (chart.type === "scatter" && chart.series.length !== 1) {
      context.addIssue({
        code: "custom",
        path: ["chart", "series"],
        message: "scatter charts require exactly one series",
      });
    }

    data.forEach((row, rowIndex) => {
      keys.forEach((key) => {
        if (!(key in row)) {
          context.addIssue({
            code: "custom",
            path: ["data", rowIndex, key],
            message: `missing required chart field: ${key}`,
          });
        }
      });
    });
  },
);

export type ScalarValue = z.infer<typeof scalarSchema>;
export type ValueFormat = z.infer<typeof valueFormatSchema>;
export type WidgetProvenance = z.infer<typeof provenanceSchema>;
export type MetricWidgetSpec = z.infer<typeof metricWidgetSchema>;
export type ChartWidgetSpec = z.infer<typeof chartWidgetSchema>;
export type TableWidgetSpec = z.infer<typeof tableWidgetSchema>;
export type InsightListWidgetSpec = z.infer<typeof insightListWidgetSchema>;
export type AnalyticsWidgetSpec = z.infer<typeof analyticsWidgetSchema>;

export function parseAnalyticsWidget(input: unknown): AnalyticsWidgetSpec {
  return analyticsWidgetSchema.parse(input);
}

export function safeParseAnalyticsWidget(input: unknown) {
  return analyticsWidgetSchema.safeParse(input);
}
