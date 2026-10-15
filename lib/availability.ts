export function parseAvailabilityDate(value: unknown, endOfDay = false) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}Z`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function formatAvailability(from: Date | string | null | undefined, until: Date | string | null | undefined) {
  if (!from && !until) return null;
  const format = (value: Date | string) => new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(value));
  if (from && until) return `${format(from)}–${format(until)}`;
  if (from) return `Available from ${format(from)}`;
  return `Available until ${format(until!)}`;
}
