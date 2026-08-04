"use client";

import * as React from "react";

import { AnalyticsWidgetHost } from "@/components/analytics";
import type {
  AnalyticsFacts,
  FactRow,
  FactScalar,
  SemanticField,
} from "@/lib/visualization/contract";

type GenericProps = Record<string, unknown> & { children?: React.ReactNode };

function toScalar(value: unknown): FactScalar {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return value;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "boolean") return value;
  return JSON.stringify(value);
}

function normalizeFacts(data: unknown): FactRow[] {
  if (!Array.isArray(data)) return [];
  return data
    .filter(
      (row): row is Record<string, unknown> =>
        Boolean(row) && typeof row === "object" && !Array.isArray(row),
    )
    .map((row) =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => [key, toScalar(value)]),
      ),
    );
}

function isDateValue(value: FactScalar): boolean {
  return (
    typeof value === "string" &&
    Number.isNaN(Number(value)) &&
    !Number.isNaN(Date.parse(value))
  );
}

function buildLegacySemanticFields(facts: FactRow[]): SemanticField[] {
  if (!facts.length) return [];
  return Object.keys(facts[0])
    .sort()
    .map((field) => {
      const values = facts
        .map((row) => row[field])
        .filter((value) => value !== null);
      const sample = values[0] ?? null;
      const lower = field.toLowerCase();
      const uniqueRatio =
        values.length > 0 ? new Set(values).size / values.length : 1;

      if (/latitude|(^|_)lat$/.test(lower)) {
        return {
          field,
          label: field,
          roles: ["latitude"],
          semanticType: "latitude",
          defaultAggregation: "none",
          allowedAggregations: ["none"],
          currency: null,
          unit: "degrees",
          priority: 90,
          hierarchy: [],
          sensitivity: "internal",
          quality: { coverage: 0.7, confidence: 0.55 },
        };
      }

      if (/longitude|(^|_)(lon|lng)$/.test(lower)) {
        return {
          field,
          label: field,
          roles: ["longitude"],
          semanticType: "longitude",
          defaultAggregation: "none",
          allowedAggregations: ["none"],
          currency: null,
          unit: "degrees",
          priority: 90,
          hierarchy: [],
          sensitivity: "internal",
          quality: { coverage: 0.7, confidence: 0.55 },
        };
      }

      if (isDateValue(sample)) {
        return {
          field,
          label: field,
          roles: ["time"],
          semanticType: "date",
          defaultAggregation: "none",
          allowedAggregations: ["none"],
          currency: null,
          unit: null,
          priority: 80,
          hierarchy: [],
          sensitivity: "internal",
          quality: { coverage: 0.7, confidence: 0.55 },
        };
      }

      if (typeof sample === "number") {
        const isNonAdditive = /days|percent|rate|score|year|latitude|longitude/.test(
          lower,
        );
        return {
          field,
          label: field,
          roles: ["measure"],
          semanticType: /percent|rate/.test(lower)
            ? "percentage"
            : /days/.test(lower)
              ? "duration"
              : "number",
          defaultAggregation: isNonAdditive ? "median" : "sum",
          allowedAggregations: isNonAdditive
            ? ["median", "mean", "min", "max"]
            : ["sum", "mean", "median", "min", "max"],
          currency: null,
          unit: /days/.test(lower) ? "day" : null,
          priority: isNonAdditive ? 40 : 60,
          hierarchy: [],
          sensitivity: "internal",
          quality: { coverage: 0.7, confidence: 0.5 },
        };
      }

      return {
        field,
        label: field,
        roles: [uniqueRatio >= 0.8 ? "identifier" : "dimension"],
        semanticType: uniqueRatio >= 0.8 ? "identifier" : "category",
        defaultAggregation: "none",
        allowedAggregations: ["none"],
        currency: null,
        unit: null,
        priority: uniqueRatio >= 0.8 ? 10 : 50,
        hierarchy: [],
        sensitivity: "internal",
        quality: { coverage: 0.7, confidence: 0.45 },
      };
    });
}

function AutomaticAnalyticsChart({
  data,
}: GenericProps & { data?: unknown }) {
  const reactId = React.useId().replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const facts = React.useMemo(() => normalizeFacts(data), [data]);
  const fields = React.useMemo(
    () => buildLegacySemanticFields(facts),
    [facts],
  );
  const generatedAt = React.useMemo(() => new Date().toISOString(), []);
  const coverageThrough = generatedAt.slice(0, 10);

  const payload = React.useMemo<AnalyticsFacts>(
    () => ({
      contractVersion: "fedpulse.analytics.facts.v2",
      datasetId: `legacy-ui-${reactId || "analytics"}`,
      title: "Automatic analytics",
      description:
        "The supplied embeddable analytics engine selected approved visuals from legacy UI facts.",
      status: {
        state: facts.length ? "ready" : "empty",
        message: facts.length ? null : "No facts were supplied.",
      },
      provenance: {
        sourceSystem: "FedPulse legacy UI facts",
        sourceUrl: null,
        productVersion: "legacy-ui-facts-adapter-v2",
        coverageThrough,
        generatedAt,
        datasetHash: null,
        requestId: null,
        evidenceIds: [],
        limitations: [
          "Legacy compatibility adapter only; production analytics must use semantic metadata returned by governed FedPulse APIs.",
          "Legacy field roles are inferred with deliberately reduced confidence.",
        ],
      },
      decision: {
        intent: "overview",
        question: null,
        audienceRole: null,
        preferredVisualId: null,
      },
      semanticModel: {
        registryVersion: "fedpulse.visual-registry.v1",
        fields,
      },
      visualPolicy: {
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
      },
      presentation: {
        theme: "auto",
        layoutMode: "auto",
        approvalMode: false,
        visualId: null,
        chartConfig: null,
        chartLayout: null,
        spec: null,
      },
      facts,
    }),
    [coverageThrough, facts, fields, generatedAt, reactId],
  );

  return (
    <AnalyticsWidgetHost
      payload={payload}
      showProvenance={false}
      className="w-full border-0 shadow-none"
    />
  );
}

function ChartPrimitive(_props: GenericProps) {
  return null;
}

export function ResponsiveContainer({ children }: GenericProps) {
  return <>{children}</>;
}

export const AreaChart = AutomaticAnalyticsChart;
export const BarChart = AutomaticAnalyticsChart;
export const PieChart = AutomaticAnalyticsChart;
export const LineChart = AutomaticAnalyticsChart;
export const ScatterChart = AutomaticAnalyticsChart;
export const ComposedChart = AutomaticAnalyticsChart;
export const RadarChart = AutomaticAnalyticsChart;
export const RadialBarChart = AutomaticAnalyticsChart;

export const Area = ChartPrimitive;
export const Bar = ChartPrimitive;
export const Pie = ChartPrimitive;
export const Cell = ChartPrimitive;
export const Line = ChartPrimitive;
export const Scatter = ChartPrimitive;
export const Radar = ChartPrimitive;
export const RadialBar = ChartPrimitive;
export const CartesianGrid = ChartPrimitive;
export const XAxis = ChartPrimitive;
export const YAxis = ChartPrimitive;
export const ZAxis = ChartPrimitive;
export const Tooltip = ChartPrimitive;
export const Legend = ChartPrimitive;
export const ReferenceLine = ChartPrimitive;
export const LabelList = ChartPrimitive;
export const PolarGrid = ChartPrimitive;
export const PolarAngleAxis = ChartPrimitive;
export const PolarRadiusAxis = ChartPrimitive;
export const Brush = ChartPrimitive;

export type TooltipValueType =
  | string
  | number
  | readonly (string | number)[];
