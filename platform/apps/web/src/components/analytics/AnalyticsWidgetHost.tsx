"use client";

import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  CircleAlert,
  Database,
  FileWarning,
  Lightbulb,
  ShieldAlert,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  safeParseAnalyticsWidget,
  type AnalyticsWidgetSpec,
  type InsightListWidgetSpec,
  type MetricWidgetSpec,
  type TableWidgetSpec,
} from "@/lib/visualization/contract";
import { formatVisualizationValue } from "@/lib/visualization/format";

import { AnalyticsChart } from "./AnalyticsChart";

export interface AnalyticsWidgetHostProps {
  spec: unknown;
  className?: string;
  showProvenance?: boolean;
}

const STATUS_STYLES = {
  ready: "border-emerald-200 bg-emerald-50 text-emerald-700",
  partial: "border-amber-200 bg-amber-50 text-amber-700",
  empty: "border-slate-200 bg-slate-50 text-slate-600",
  error: "border-red-200 bg-red-50 text-red-700",
} as const;

function StatusBadge({ spec }: { spec: AnalyticsWidgetSpec }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest",
        STATUS_STYLES[spec.status.state],
      )}
    >
      {spec.status.state}
    </span>
  );
}

function StatePanel({ spec }: { spec: AnalyticsWidgetSpec }) {
  const isError = spec.status.state === "error";
  const Icon = isError ? CircleAlert : FileWarning;
  const fallback = isError
    ? "This governed result could not be produced."
    : "No governed result is available for the current request.";

  return (
    <div className="flex min-h-44 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
      <div className="rounded-full bg-muted p-3">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="max-w-md text-sm font-medium text-muted-foreground">
        {spec.status.message ?? fallback}
      </p>
    </div>
  );
}

function MetricWidget({ spec }: { spec: MetricWidgetSpec }) {
  return (
    <div className="rounded-2xl border border-border bg-muted/20 p-6">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {spec.metric.label ?? spec.title}
      </p>
      <p className="mt-3 text-4xl font-black tracking-tight text-foreground">
        {formatVisualizationValue(spec.metric.value, spec.metric.format)}
      </p>
      {spec.metric.context ? (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {spec.metric.context}
        </p>
      ) : null}
      {spec.metric.trendLabel ? (
        <p className="mt-4 inline-flex rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
          {spec.metric.trendLabel}
        </p>
      ) : null}
    </div>
  );
}

function TableWidget({ spec }: { spec: TableWidgetSpec }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-muted/30">
            <tr>
              {spec.table.columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
                    column.align === "center" && "text-center",
                    column.align === "right" && "text-right",
                  )}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {spec.table.rows.map((row, rowIndex) => (
              <tr
                key={
                  spec.table.rowKey && row[spec.table.rowKey] !== undefined
                    ? String(row[spec.table.rowKey])
                    : rowIndex
                }
                className="bg-card transition-colors hover:bg-muted/20"
              >
                {spec.table.columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      "px-4 py-3 text-foreground",
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right tabular-nums",
                    )}
                  >
                    {formatVisualizationValue(row[column.key], column.format)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const INSIGHT_STYLES = {
  info: {
    icon: Lightbulb,
    className: "border-slate-200 bg-slate-50 text-slate-700",
  },
  opportunity: {
    icon: CheckCircle2,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  watch: {
    icon: AlertTriangle,
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  risk: {
    icon: ShieldAlert,
    className: "border-red-200 bg-red-50 text-red-700",
  },
} as const;

function InsightListWidget({ spec }: { spec: InsightListWidgetSpec }) {
  return (
    <div className="space-y-3">
      {spec.insights.map((insight) => {
        const appearance = INSIGHT_STYLES[insight.severity];
        const Icon = appearance.icon;
        return (
          <article
            key={insight.id}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "mt-0.5 rounded-lg border p-2",
                  appearance.className,
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-foreground">{insight.title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {insight.summary}
                </p>
                {insight.evidenceIds.length ? (
                  <p className="mt-2 text-[11px] font-medium text-muted-foreground">
                    Evidence: {insight.evidenceIds.join(", ")}
                  </p>
                ) : null}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function EvidenceFooter({ spec }: { spec: AnalyticsWidgetSpec }) {
  const provenance = spec.provenance;
  return (
    <details className="group border-t border-border px-5 py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-xs font-semibold text-muted-foreground hover:text-foreground">
        <span className="inline-flex items-center gap-2">
          <Database className="h-3.5 w-3.5" />
          Evidence and data lineage
        </span>
        <span className="font-normal">{provenance.sourceSystem}</span>
      </summary>
      <div className="mt-4 grid gap-3 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-bold uppercase tracking-wider">Product version</p>
          <p className="mt-1 break-words text-foreground">{provenance.productVersion}</p>
        </div>
        <div>
          <p className="font-bold uppercase tracking-wider">Coverage through</p>
          <p className="mt-1 text-foreground">{provenance.coverageThrough}</p>
        </div>
        <div>
          <p className="font-bold uppercase tracking-wider">Generated</p>
          <p className="mt-1 text-foreground">{provenance.generatedAt}</p>
        </div>
        <div>
          <p className="font-bold uppercase tracking-wider">Request</p>
          <p className="mt-1 break-words text-foreground">
            {provenance.requestId ?? "Not supplied"}
          </p>
        </div>
      </div>
      {provenance.evidenceIds.length ? (
        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Evidence IDs
          </p>
          <p className="mt-1 break-words text-xs text-foreground">
            {provenance.evidenceIds.join(", ")}
          </p>
        </div>
      ) : null}
      {provenance.limitations.length ? (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          <p className="font-bold">Limitations</p>
          <ul className="mt-1 list-disc space-y-1 pl-4">
            {provenance.limitations.map((limitation) => (
              <li key={limitation}>{limitation}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {provenance.sourceUrl ? (
        <a
          className="mt-4 inline-flex text-xs font-semibold text-primary hover:underline"
          href={provenance.sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          Open source record
        </a>
      ) : null}
    </details>
  );
}

function hasNoRenderableData(spec: AnalyticsWidgetSpec): boolean {
  if (spec.kind === "chart") return spec.data.length === 0;
  if (spec.kind === "table") return spec.table.rows.length === 0;
  if (spec.kind === "insight_list") return spec.insights.length === 0;
  return false;
}

function WidgetBody({ spec }: { spec: AnalyticsWidgetSpec }) {
  if (spec.status.state === "error" || spec.status.state === "empty") {
    return <StatePanel spec={spec} />;
  }

  if (hasNoRenderableData(spec)) return <StatePanel spec={spec} />;
  if (spec.kind === "metric") return <MetricWidget spec={spec} />;
  if (spec.kind === "chart") return <AnalyticsChart spec={spec} />;
  if (spec.kind === "table") return <TableWidget spec={spec} />;
  return <InsightListWidget spec={spec} />;
}

export function AnalyticsWidgetHost({
  spec: input,
  className,
  showProvenance = true,
}: AnalyticsWidgetHostProps) {
  const parsed = safeParseAnalyticsWidget(input);

  if (!parsed.success) {
    return (
      <section
        className={cn(
          "overflow-hidden rounded-2xl border border-red-200 bg-card shadow-sm",
          className,
        )}
        aria-label="Invalid analytics widget"
      >
        <div className="flex min-h-52 flex-col items-center justify-center gap-3 px-6 py-10 text-center">
          <div className="rounded-full bg-red-50 p-3 text-red-600">
            <CircleAlert className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">Widget unavailable</h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              The analytics response did not match the FedPulse visualization contract.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const spec = parsed.data;
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
        className,
      )}
      aria-labelledby={`${spec.widgetId}-title`}
    >
      <header className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-primary">
            <BarChart3 className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Governed analytics
            </span>
          </div>
          <h2
            id={`${spec.widgetId}-title`}
            className="mt-1 text-lg font-extrabold tracking-tight text-foreground"
          >
            {spec.title}
          </h2>
          {spec.description ? (
            <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
              {spec.description}
            </p>
          ) : null}
        </div>
        <StatusBadge spec={spec} />
      </header>

      <div className="p-5">
        <WidgetBody spec={spec} />
      </div>

      {showProvenance ? <EvidenceFooter spec={spec} /> : null}
    </section>
  );
}
