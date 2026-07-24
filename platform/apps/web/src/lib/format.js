export function formatCurrency(value) {
  if (value === null || value === undefined) return '$0';
  
  const num = Number(value);
  if (isNaN(num)) return '$0';

  if (num >= 1000000000) {
    return `$${(num / 1000000000).toFixed(1)}B`;
  }
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `$${(num / 1000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatNumber(value) {
  if (value === null || value === undefined) return '0';
  const num = Number(value);
  if (isNaN(num)) return '0';
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(date);
  } catch (e) {
    return dateStr;
  }
}

export function getDaysUrgency(days) {
  if (days === null || days === undefined) return 'normal';
  if (days < 30) return 'critical';
  if (days < 90) return 'warning';
  if (days < 180) return 'attention';
  return 'normal';
}

export function getUrgencyColor(urgency) {
  switch (urgency) {
    case 'critical':
      return 'var(--accent-red)';
    case 'warning':
      return 'var(--accent-amber)';
    case 'attention':
      return 'var(--accent-blue)';
    default:
      return 'var(--text-muted)';
  }
}
