"use client";

import {
  AlertTriangle,
  BarChart3,
  CircleAlert,
  Database,
  LoaderCircle,
} from "lucide-react";
import {
  createElement,
  type CSSProperties,
  type MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";
import {
  safeParseAnalyticsFacts,
  type AnalyticsFacts,
  type FactRow,
} from "@/lib/visualization/contract";

const WIDGET_SCRIPT_ID = "fedpulse-embeddable-analytics-script";
const WIDGET_SCRIPT_SOURCE = "/vendor/embeddable-analytics/widget.js";

interface ChartWidgetElement extends HTMLElement {
  data: FactRow[];
}

export interface DashboardFeedbackDetail {
  timestamp: string;
  decision: "approved" | "rejected";
  inputProfiles: Record<string, unknown>;
  outputDashboard: Record<string, unknown>;
}

export interface AnalyticsWidgetHostProps {
  payload: unknown;
  className?: string;
  showProvenance?: boolean;
  onDashboardFeedback?: (feedback: DashboardFeedbackDetail) => void;
}

let widgetLoadPromise: Promise<void> | null = null;

function loadEmbeddableAnalytics(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (customElements.get("chart-widget")) return Promise.resolve();
  if (widgetLoadPromise) return widgetLoadPromise;

  widgetLoadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(
      WIDGET_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    const finish = () => {
      customElements.whenDefined("chart-widget").then(() => resolve(), reject);
    };

    if (existing) {
      existing.addEventListener("load", finish, { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Embeddable analytics failed to load")),
        { once: true },
      );
      finish();
      return;
    }

    const script = document.createElement("script");
    script.id = WIDGET_SCRIPT_ID;
    script.type = "module";
    script.src = WIDGET_SCRIPT_SOURCE;
    script.addEventListener("load", finish, { once: true });
    script.addEventListener(
      "error",
      () => reject(new Error("Embeddable analytics failed to load")),
      { once: true },
    );
    document.head.appendChild(script);
  });

  return widgetLoadPromise;
}

function setJsonAttribute(
  element: HTMLElement,
  name: string,
  value: Record<string, unknown> | unknown[] | null | undefined,
) {
  if (value === null || value === undefined) {
    element.removeAttribute(name);
    return;
  }
  element.setAttribute(name, JSON.stringify(value));
}

function applyPayloadToWidget(
  element: ChartWidgetElement,
  payload: AnalyticsFacts,
) {
  const { presentation } = payload;
  element.setAttribute("theme", presentation.theme);
  element.setAttribute("layout-mode", presentation.layoutMode);
  element.setAttribute(
    "approval-mode",
    presentation.approvalMode ? "true" : "false",
  );
  setJsonAttribute(element, "chart-config", presentation.chartConfig);
  setJsonAttribute(element, "chart-layout", presentation.chartLayout);
  setJsonAttribute(element, "spec", presentation.spec);
  element.data = payload.facts;
}

function LoadingPanel() {
  return (
    <div className="flex min-h-52 items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/20 px-6 py-10 text-sm text-muted-foreground">
      <LoaderCircle className="h-5 w-5 animate-spin" />
      Loading the embeddable analytics engine…
    </div>
  );
}

function StatePanel({ payload }: { payload: AnalyticsFacts }) {
  const isError = payload.status.state === "error";
  const Icon = isError ? CircleAlert : AlertTriangle;
  return (
    <div className="flex min-h-52 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
      <Icon className="h-6 w-6 text-muted-foreground" />
      <p className="max-w-lg text-sm text-muted-foreground">
        {payload.status.message ??
          (isError
            ? "The governed fact set could not be produced."
            : "No governed facts match the current request.")}
      </p>
    </div>
  );
}

function EvidenceFooter({ payload }: { payload: AnalyticsFacts }) {
  const provenance = payload.provenance;
  return (
    <details className="border-t border-border px-5 py-4">
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
          <p className="mt-1 break-words text-foreground">
            {provenance.productVersion}
          </p>
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

function WidgetMount({
  payload,
  widgetRef,
  onDashboardFeedback,
}: {
  payload: AnalyticsFacts;
  widgetRef: MutableRefObject<ChartWidgetElement | null>;
  onDashboardFeedback?: (feedback: DashboardFeedbackDetail) => void;
}) {
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    let active = true;
    loadEmbeddableAnalytics()
      .then(() => {
        if (active) setLoadState("ready");
      })
      .catch(() => {
        if (active) setLoadState("error");
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (loadState !== "ready" || !widgetRef.current) return;
    applyPayloadToWidget(widgetRef.current, payload);
  }, [loadState, payload, widgetRef]);

  useEffect(() => {
    const element = widgetRef.current;
    if (!element || !onDashboardFeedback) return;

    const listener = (event: Event) => {
      onDashboardFeedback(
        (event as CustomEvent<DashboardFeedbackDetail>).detail,
      );
    };
    element.addEventListener("dashboard-feedback", listener);
    return () => element.removeEventListener("dashboard-feedback", listener);
  }, [loadState, onDashboardFeedback, widgetRef]);

  if (loadState === "loading") return <LoadingPanel />;
  if (loadState === "error") {
    return (
      <div className="flex min-h-52 flex-col items-center justify-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center text-red-700">
        <CircleAlert className="h-6 w-6" />
        <p className="text-sm font-medium">
          The embeddable analytics engine could not be loaded.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl">
      {createElement("chart-widget", {
        ref: (node: HTMLElement | null) => {
          widgetRef.current = node as ChartWidgetElement | null;
        },
      })}
    </div>
  );
}

export function AnalyticsWidgetHost({
  payload: input,
  className,
  showProvenance = true,
  onDashboardFeedback,
}: AnalyticsWidgetHostProps) {
  const parsed = safeParseAnalyticsFacts(input);
  const widgetRef = useRef<ChartWidgetElement | null>(null);

  if (!parsed.success) {
    return (
      <section
        className={cn(
          "overflow-hidden rounded-2xl border border-red-200 bg-card shadow-sm",
          className,
        )}
        aria-label="Invalid analytics facts"
      >
        <div className="flex min-h-52 flex-col items-center justify-center gap-3 px-6 py-10 text-center">
          <CircleAlert className="h-6 w-6 text-red-600" />
          <h2 className="font-bold text-foreground">Analytics unavailable</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            The response did not match the governed FedPulse facts contract.
          </p>
        </div>
      </section>
    );
  }

  const payload = parsed.data;
  const widgetStyle = {
    "--w-chart-primary": "hsl(var(--primary))",
    "--w-chart-secondary": "hsl(var(--chart-2))",
  } as CSSProperties;

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
        className,
      )}
      aria-labelledby={`${payload.datasetId}-title`}
    >
      <header className="border-b border-border px-5 py-4">
        <div className="flex items-center gap-2 text-primary">
          <BarChart3 className="h-4 w-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Governed facts · automatic visualization
          </span>
        </div>
        <h2
          id={`${payload.datasetId}-title`}
          className="mt-1 text-lg font-extrabold tracking-tight text-foreground"
        >
          {payload.title}
        </h2>
        {payload.description ? (
          <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
            {payload.description}
          </p>
        ) : null}
      </header>

      <div className="p-4" style={widgetStyle}>
        {["empty", "error"].includes(payload.status.state) ? (
          <StatePanel payload={payload} />
        ) : (
          <WidgetMount
            payload={payload}
            widgetRef={widgetRef}
            onDashboardFeedback={onDashboardFeedback}
          />
        )}
      </div>

      {showProvenance ? <EvidenceFooter payload={payload} /> : null}
    </section>
  );
}
