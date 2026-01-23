// Error message extraction utility
export function getErrorMessage(err: unknown, fallback = 'An error occurred'): string {
  return err instanceof Error ? err.message : fallback;
}

export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(date: Date | string | number): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function formatNumber(value: number, decimals: number = 1): string {
  return value.toFixed(decimals);
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function formatBarcode(barcode: string): string {
  // Format barcode with spaces for readability
  if (barcode.length === 13) {
    // EAN-13: X-XXXXXX-XXXXX-X
    return `${barcode.slice(0, 1)}-${barcode.slice(1, 7)}-${barcode.slice(7, 12)}-${barcode.slice(12)}`;
  }
  if (barcode.length === 12) {
    // UPC-A: X-XXXXX-XXXXX-X
    return `${barcode.slice(0, 1)}-${barcode.slice(1, 6)}-${barcode.slice(6, 11)}-${barcode.slice(11)}`;
  }
  return barcode;
}

export function formatWeight(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}kg`;
  }
  return `${value.toFixed(0)}g`;
}

export function formatEnergy(kcal: number): string {
  const kj = Math.round(kcal * 4.184);
  return `${kcal} kcal (${kj} kJ)`;
}
