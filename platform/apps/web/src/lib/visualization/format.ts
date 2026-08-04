import type { ScalarValue, ValueFormat } from "./contract";

const DEFAULT_NUMBER_FORMAT: ValueFormat = {
  style: "number",
  notation: "standard",
  decimals: 0,
  percentScale: "points",
};

function applyAffixes(value: string, format: ValueFormat): string {
  return `${format.prefix ?? ""}${value}${format.suffix ?? ""}`;
}

export function formatVisualizationValue(
  value: ScalarValue,
  requestedFormat?: ValueFormat,
): string {
  if (value === null || value === undefined) return "—";

  const format = requestedFormat ?? DEFAULT_NUMBER_FORMAT;

  if (format.style === "text" || typeof value === "boolean") {
    return applyAffixes(String(value), format);
  }

  if (format.style === "date") {
    const parsed = new Date(String(value));
    if (Number.isNaN(parsed.getTime())) return applyAffixes(String(value), format);

    return applyAffixes(
      new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(parsed),
      format,
    );
  }

  if (typeof value !== "number") return applyAffixes(String(value), format);

  if (format.style === "currency") {
    return applyAffixes(
      new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: format.currency,
        currencyDisplay: "narrowSymbol",
        notation: format.notation,
        minimumFractionDigits: format.decimals,
        maximumFractionDigits: format.decimals,
      }).format(value),
      format,
    );
  }

  if (format.style === "percent") {
    const fraction = format.percentScale === "points" ? value / 100 : value;
    return applyAffixes(
      new Intl.NumberFormat("en-CA", {
        style: "percent",
        notation: format.notation,
        minimumFractionDigits: format.decimals,
        maximumFractionDigits: format.decimals,
      }).format(fraction),
      format,
    );
  }

  return applyAffixes(
    new Intl.NumberFormat("en-CA", {
      notation: format.notation,
      minimumFractionDigits: format.decimals,
      maximumFractionDigits: format.decimals,
    }).format(value),
    format,
  );
}
