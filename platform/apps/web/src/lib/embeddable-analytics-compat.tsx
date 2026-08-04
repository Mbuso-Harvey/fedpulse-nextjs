"use client";

import * as React from "react";

import { AnalyticsWidgetHost } from "@/components/analytics";
import type { FactRow, FactScalar } from "@/lib/visualization/contract";

type GenericProps = Record<string, unknown> & { children?: React.ReactNode };

function toScalar(value: unknown): FactScalar {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return value;
  if (typeof value === "number") return value;
  if (typeof value === "boolean") return value;
  return JSON.stringify(value);
}

function normalizeFacts(data: unknown): FactRow[] {
  if (!Array.isArray(data)) return [];
  return data
    .filter((row): row is Record<string, unknown> =>
      Boolean(row) && typeof row === "object" && !Array.isArray(row),
    )
    .map((row) =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => [key, toScalar(value)]),
      ),
    );
}

function AutomaticAnalyticsChart({ data }: GenericProps & { data?: unknown }) {
  const reactId = React.useId().replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const facts = React.useMemo(() => normalizeFacts(data), [data]);
  const generatedAt = React.useMemo(() => new Date().toISOString(), []);
  const coverageThrough = generatedAt.slice(0, 10);

  const payload = React.useMemo(
    () => ({
      contractVersion: "fedpulse.analytics.facts.v1",
      datasetId: `legacy-ui-${reactId || "analytics"}`,
      title: "Automatic analytics",
      description:
        "The supplied embeddable analytics engine selected this visual from the provided facts.",
      status: {
        state: facts.length ? "ready" : "empty",
        message: facts.length ? null : "No facts were supplied.",
      },
      provenance: {
        sourceSystem: "FedPulse supplied facts",
        sourceUrl: null,
        productVersion: "legacy-ui-facts-adapter-v1",
        coverageThrough,
        generatedAt,
        datasetHash: null,
        requestId: null,
        evidenceIds: [],
        limitations: [
          "Legacy UI adapter; production analytics must use facts returned by governed FedPulse APIs.",
        ],
      },
      presentation: {
        theme: "auto",
        layoutMode: "auto",
        approvalMode: false,
        chartConfig: null,
        chartLayout: null,
        spec: null,
      },
      facts,
    }),
    [coverageThrough, facts, generatedAt, reactId],
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

export type TooltipValueType = string | number | readonly (string | number)[];
