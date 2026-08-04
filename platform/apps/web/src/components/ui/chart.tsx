"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
>;

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ReactNode;
  initialDimension?: { width: number; height: number };
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`;

  return (
    <div
      data-slot="chart"
      data-chart={chartId}
      className={cn("flex w-full justify-center", className)}
      {...props}
    >
      <ChartStyle id={chartId} config={config} />
      {children}
    </div>
  );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, item]) => item.theme ?? item.color,
  );
  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `\n${prefix} [data-chart=${id}] {\n${colorConfig
              .map(([key, item]) => {
                const color =
                  item.theme?.[theme as keyof typeof item.theme] ?? item.color;
                return color ? `  --color-${key}: ${color};` : null;
              })
              .join("\n")}\n}\n`,
          )
          .join("\n"),
      }}
    />
  );
};

function ChartTooltip(_props: Record<string, unknown>) {
  return null;
}

function ChartTooltipContent(_props: Record<string, unknown>) {
  return null;
}

function ChartLegend(_props: Record<string, unknown>) {
  return null;
}

function ChartLegendContent(_props: Record<string, unknown>) {
  return null;
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
