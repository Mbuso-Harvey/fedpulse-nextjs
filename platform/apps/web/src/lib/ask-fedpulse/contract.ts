import { z } from "zod";

import {
  analyticsFactsSchema,
  approvedVisualIdSchema,
} from "@/lib/visualization/contract";

export const ASK_FEDPULSE_CONTRACT_VERSION =
  "fedpulse.ask.response.v1" as const;
export const ASK_FEDPULSE_TOOL_NAME =
  "query_ca_renewal_intelligence" as const;

export const askFedPulseAnalysisIdSchema = z.enum([
  "renewal_watchlist",
  "renewal_value_by_department",
  "renewal_value_by_supplier",
  "renewal_expiry_trend",
  "renewal_value_by_category",
  "renewal_value_distribution",
  "renewal_score_relationship",
  "department_supplier_flow",
]);

export const askFedPulseFiltersSchema = z
  .object({
    department: z.string().min(1).max(200).nullish(),
    supplier: z.string().min(1).max(240).nullish(),
    category: z.string().min(1).max(160).nullish(),
    minValue: z.number().finite().nonnegative().nullish(),
    maxValue: z.number().finite().nonnegative().nullish(),
    daysUntilEndMin: z.number().int().min(-3650).max(36500).nullish(),
    daysUntilEndMax: z.number().int().min(-3650).max(36500).nullish(),
    expiryFrom: z.string().date().nullish(),
    expiryTo: z.string().date().nullish(),
  })
  .strict()
  .superRefine((filters, context) => {
    if (
      filters.minValue != null &&
      filters.maxValue != null &&
      filters.minValue > filters.maxValue
    ) {
      context.addIssue({
        code: "custom",
        path: ["minValue"],
        message: "minValue cannot exceed maxValue",
      });
    }
    if (
      filters.daysUntilEndMin != null &&
      filters.daysUntilEndMax != null &&
      filters.daysUntilEndMin > filters.daysUntilEndMax
    ) {
      context.addIssue({
        code: "custom",
        path: ["daysUntilEndMin"],
        message: "daysUntilEndMin cannot exceed daysUntilEndMax",
      });
    }
    if (
      filters.expiryFrom != null &&
      filters.expiryTo != null &&
      filters.expiryFrom > filters.expiryTo
    ) {
      context.addIssue({
        code: "custom",
        path: ["expiryFrom"],
        message: "expiryFrom cannot be after expiryTo",
      });
    }
  });

export const askFedPulseVisualContextSchema = z
  .object({
    preferredVisualId: approvedVisualIdSchema.nullish(),
    recentVisualIds: z.array(approvedVisualIdSchema).max(20).default([]),
    accessibilityMode: z
      .enum(["standard", "high-contrast"])
      .default("standard"),
    audienceRole: z.string().min(1).max(100).nullish(),
  })
  .strict()
  .default({
    preferredVisualId: null,
    recentVisualIds: [],
    accessibilityMode: "standard",
    audienceRole: null,
  });

export const askFedPulseRequestSchema = z
  .object({
    question: z.string().min(3).max(600),
    analysisId: askFedPulseAnalysisIdSchema,
    filters: askFedPulseFiltersSchema.default({}),
    limit: z.number().int().min(1).max(1000).default(100),
    visualContext: askFedPulseVisualContextSchema,
  })
  .strict();

export const askFedPulseExecutionSchema = z
  .object({
    toolName: z.literal(ASK_FEDPULSE_TOOL_NAME),
    analysisId: askFedPulseAnalysisIdSchema,
    state: z.enum(["success", "empty", "unavailable"]),
    requestId: z.string().min(1).max(120),
    userTier: z.string().min(1).max(60),
    sourceProductVersion: z.string().max(100).nullish(),
    rowsScanned: z.number().int().nonnegative(),
    rowsMatched: z.number().int().nonnegative(),
    rowsReturned: z.number().int().nonnegative(),
    filtersApplied: z.record(z.string(), z.unknown()),
    queryPlan: z.array(z.string().min(1).max(300)).min(1).max(20),
    warnings: z.array(z.string().min(1).max(500)).max(20),
  })
  .strict();

export const askFedPulseResponseSchema = z
  .object({
    contractVersion: z.literal(ASK_FEDPULSE_CONTRACT_VERSION),
    answer: z.string().min(1).max(1200),
    analytics: analyticsFactsSchema,
    execution: askFedPulseExecutionSchema,
  })
  .strict();

export type AskFedPulseAnalysisId = z.infer<
  typeof askFedPulseAnalysisIdSchema
>;
export type AskFedPulseRequest = z.infer<typeof askFedPulseRequestSchema>;
export type AskFedPulseResponse = z.infer<typeof askFedPulseResponseSchema>;

export function parseAskFedPulseResponse(input: unknown): AskFedPulseResponse {
  return askFedPulseResponseSchema.parse(input);
}
