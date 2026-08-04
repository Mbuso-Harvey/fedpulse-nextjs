"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartWidgetSpec, ScalarValue, ValueFormat } from "@/lib/visualization/contract";
import { formatVisualizationValue } from "@/lib/visualization/format";

const SERIES_COLOURS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

function colourFor(index: number): string {
  return SERIES_COLOURS[index % SERIES_COLOURS.length];
}

function tooltipFormatter(
  series: ChartWidgetSpec["chart"]["series"],
) {
  return (value: ScalarValue, name: string) => {
    const matchedSeries = series.find(
      (candidate) => candidate.dataKey === name || candidate.label === name,
    );
    return [
      formatVisualizationValue(value, matchedSeries?.format),
      matchedSeries?.label ?? name,
    ];
  };
}

function axisFormatter(format?: ValueFormat) {
  return (value: ScalarValue) => formatVisualizationValue(value, format);
}

function SharedTooltip({ spec }: { spec: ChartWidgetSpec }) {
  return (
    <Tooltip
      formatter={tooltipFormatter(spec.chart.series)}
      contentStyle={{
        borderRadius: "0.75rem",
        border: "1px solid hsl(var(--border))",
        background: "hsl(var(--card))",
        color: "hsl(var(--card-foreground))",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
      }}
      labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 700 }}
    />
  );
}

export function AnalyticsChart({ spec }: { spec: ChartWidgetSpec }) {
  const { chart, data } = spec;
  const primaryFormat = chart.series[0]?.format;

  if (chart.type === "pie") {
    const series = chart.series[0];
    return (
      <div className="h-[340px] w-full" role="img" aria-label={spec.title}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey={series.dataKey}
              nameKey={chart.xKey}
              innerRadius={62}
              outerRadius={112}
              paddingAngle={2}
            >
              {data.map((row, index) => (
                <Cell
                  key={`${String(row[chart.xKey])}-${index}`}
                  fill={colourFor(index)}
                />
              ))}
            </Pie>
            <SharedTooltip spec={spec} />
            {chart.showLegend ? <Legend /> : null}
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (chart.type === "scatter") {
    const series = chart.series[0];
    return (
      <div className="h-[340px] w-full" role="img" aria-label={spec.title}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 12, right: 20, bottom: 18, left: 12 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              type="number"
              dataKey={chart.xKey}
              name={chart.xLabel ?? chart.xKey}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="number"
              dataKey={series.dataKey}
              name={chart.yLabel ?? series.label}
              tickFormatter={axisFormatter(series.format)}
              tickLine={false}
              axisLine={false}
              width={76}
            />
            <SharedTooltip spec={spec} />
            {chart.showLegend ? <Legend /> : null}
            <Scatter
              name={series.label}
              data={data}
              fill={colourFor(0)}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (chart.type === "line") {
    return (
      <div className="h-[340px] w-full" role="img" aria-label={spec.title}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 20, bottom: 18, left: 12 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey={chart.xKey}
              tickLine={false}
              axisLine={false}
              minTickGap={24}
            />
            <YAxis
              tickFormatter={axisFormatter(primaryFormat)}
              tickLine={false}
              axisLine={false}
              width={76}
            />
            <SharedTooltip spec={spec} />
            {chart.showLegend ? <Legend /> : null}
            {chart.series.map((series, index) => (
              <Line
                key={series.dataKey}
                type="monotone"
                dataKey={series.dataKey}
                name={series.label}
                stroke={colourFor(index)}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  const rowBars = chart.barDirection === "rows";
  return (
    <div className="h-[340px] w-full" role="img" aria-label={spec.title}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout={rowBars ? "vertical" : "horizontal"}
          margin={{ top: 12, right: 20, bottom: 18, left: rowBars ? 36 : 12 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={!rowBars} horizontal={rowBars} />
          {rowBars ? (
            <>
              <XAxis
                type="number"
                tickFormatter={axisFormatter(primaryFormat)}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey={chart.xKey}
                tickLine={false}
                axisLine={false}
                width={140}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey={chart.xKey}
                tickLine={false}
                axisLine={false}
                minTickGap={16}
              />
              <YAxis
                tickFormatter={axisFormatter(primaryFormat)}
                tickLine={false}
                axisLine={false}
                width={76}
              />
            </>
          )}
          <SharedTooltip spec={spec} />
          {chart.showLegend ? <Legend /> : null}
          {chart.series.map((series, index) => (
            <Bar
              key={series.dataKey}
              dataKey={series.dataKey}
              name={series.label}
              fill={colourFor(index)}
              radius={rowBars ? [0, 6, 6, 0] : [6, 6, 0, 0]}
              stackId={chart.stacked ? "widget-stack" : undefined}
              maxBarSize={54}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
