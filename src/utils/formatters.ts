import { RiskLevel, BusinessTier } from '../types';

/**
 * Format Indian Rupee Currency with proper commas (Lakhs and Crores system)
 * e.g. 1000000 -> "₹10,00,000" or "₹10.00 Lakh"
 */
export function formatINR(amount: number, compact: boolean = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }

  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (compact) {
    if (absAmount >= 10000000) {
      // Crores
      const cr = (absAmount / 10000000).toFixed(2);
      return `${sign}₹${cr} Cr`;
    }
    if (absAmount >= 100000) {
      // Lakhs
      const lakh = (absAmount / 100000).toFixed(2);
      return `${sign}₹${lakh} Lakh`;
    }
    if (absAmount >= 1000) {
      const k = (absAmount / 1000).toFixed(1);
      return `${sign}₹${k} K`;
    }
    return `${sign}₹${absAmount.toLocaleString('en-IN')}`;
  }

  // Full Indian comma separation
  return `${sign}₹${Math.round(absAmount).toLocaleString('en-IN')}`;
}

export function formatCompactINR(amount: number): string {
  return formatINR(amount, true);
}

export function getRiskColorClass(level: RiskLevel): {
  bg: string;
  text: string;
  border: string;
  badge: string;
  ring: string;
  hex: string;
} {
  switch (level) {
    case 'GREEN':
      return {
        bg: 'bg-emerald-950/40',
        text: 'text-emerald-400',
        border: 'border-emerald-700/50',
        badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
        ring: 'ring-emerald-500',
        hex: '#10b981',
      };
    case 'YELLOW':
      return {
        bg: 'bg-amber-950/40',
        text: 'text-amber-400',
        border: 'border-amber-700/50',
        badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        ring: 'ring-amber-500',
        hex: '#f59e0b',
      };
    case 'ORANGE':
      return {
        bg: 'bg-orange-950/40',
        text: 'text-orange-400',
        border: 'border-orange-700/50',
        badge: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
        ring: 'ring-orange-500',
        hex: '#f97316',
      };
    case 'RED':
      return {
        bg: 'bg-rose-950/40',
        text: 'text-rose-400',
        border: 'border-rose-700/50',
        badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
        ring: 'ring-rose-500',
        hex: '#ef4444',
      };
    default:
      return {
        bg: 'bg-slate-900',
        text: 'text-slate-300',
        border: 'border-slate-700',
        badge: 'bg-slate-800 text-slate-300 border-slate-700',
        ring: 'ring-slate-500',
        hex: '#64748b',
      };
  }
}

export function getTierLabel(tier: BusinessTier): string {
  switch (tier) {
    case 'OEM':
      return 'Anchor OEM / Tier 0';
    case 'TIER_1':
      return 'Tier 1 Prime Supplier';
    case 'TIER_2':
      return 'Tier 2 Component MSME';
    case 'TIER_3':
      return 'Tier 3 Micro Sub-Supplier';
    default:
      return tier;
  }
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}
