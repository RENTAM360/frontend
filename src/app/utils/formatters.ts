export function formatNumber(value?: number | null): string {
  if (value == null || isNaN(value)) return "0";
  return value.toFixed(2);
}

export function formatCurrency(value?: number | null): string {
  if (value == null || isNaN(value)) return "₦0";

  if (value >= 1_000_000_000) {
    return `₦${(value / 1_000_000_000).toFixed(2)}B`;
  } else if (value >= 1_000_000) {
    return `₦${(value / 1_000_000).toFixed(2)}M`;
  } else if (value >= 1_000) {
    return `₦${value.toLocaleString()}`;
  } else {
    return `₦${value}`;
  }
}
