import {
  AdditiveRegulatoryData,
  RegulatoryJurisdiction,
  RegulatoryStatus,
  RegulatoryInfo,
} from '@/types';

/**
 * Regulatory Status Comparison (Feature 3)
 *
 * Tracks which additives are banned, restricted, or require warnings
 * in different jurisdictions. Helps users understand global safety perspectives.
 */

// Display names for jurisdictions
export const JURISDICTION_NAMES: Record<RegulatoryJurisdiction, string> = {
  usa: 'USA',
  eu: 'European Union',
  canada: 'Canada',
  uk: 'United Kingdom',
  australia: 'Australia',
  california: 'California',
};

// Flag emojis for jurisdictions (optional display)
export const JURISDICTION_FLAGS: Record<RegulatoryJurisdiction, string> = {
  usa: '🇺🇸',
  eu: '🇪🇺',
  canada: '🇨🇦',
  uk: '🇬🇧',
  australia: '🇦🇺',
  california: '🏴', // California state flag representation
};

// Status display information
export const STATUS_INFO: Record<
  RegulatoryStatus,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  approved: {
    label: 'Approved',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  restricted: {
    label: 'Restricted',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  banned: {
    label: 'Banned',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  warning_required: {
    label: 'Warning Required',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
};

/**
 * Comprehensive regulatory database for additives.
 * Key regulatory differences documented here.
 */
export const ADDITIVE_REGULATORY_DATA: Record<string, AdditiveRegulatoryData> = {
  // ============================================
  // BANNED ADDITIVES
  // ============================================

  E123: {
    code: 'E123',
    regulations: [
      { jurisdiction: 'usa', status: 'banned', notes: 'Banned since 1976 due to cancer concerns' },
      { jurisdiction: 'eu', status: 'approved', notes: 'Permitted with restrictions' },
      { jurisdiction: 'canada', status: 'banned' },
      { jurisdiction: 'uk', status: 'approved' },
      { jurisdiction: 'australia', status: 'approved', notes: 'ADI of 0.5 mg/kg' },
    ],
    bannedIn: ['usa', 'canada'],
    restrictedIn: [],
  },

  E127: {
    code: 'E127',
    regulations: [
      {
        jurisdiction: 'usa',
        status: 'restricted',
        notes: 'Limited to specific uses; banned in cosmetics',
      },
      { jurisdiction: 'eu', status: 'approved', notes: 'Limited uses' },
      { jurisdiction: 'california', status: 'banned', notes: 'Ban effective January 2027' },
    ],
    bannedIn: ['california'],
    restrictedIn: ['usa'],
  },

  E128: {
    code: 'E128',
    regulations: [
      { jurisdiction: 'usa', status: 'banned' },
      { jurisdiction: 'eu', status: 'banned', notes: 'Banned since 2007' },
      { jurisdiction: 'canada', status: 'banned' },
      { jurisdiction: 'uk', status: 'banned' },
      { jurisdiction: 'australia', status: 'banned' },
    ],
    bannedIn: ['usa', 'eu', 'canada', 'uk', 'australia'],
    restrictedIn: [],
  },

  E142: {
    code: 'E142',
    regulations: [
      { jurisdiction: 'usa', status: 'banned' },
      { jurisdiction: 'eu', status: 'approved' },
      { jurisdiction: 'canada', status: 'banned' },
      { jurisdiction: 'australia', status: 'approved' },
    ],
    bannedIn: ['usa', 'canada'],
    restrictedIn: [],
  },

  E151: {
    code: 'E151',
    regulations: [
      { jurisdiction: 'usa', status: 'banned' },
      { jurisdiction: 'eu', status: 'approved' },
      { jurisdiction: 'canada', status: 'banned' },
      { jurisdiction: 'australia', status: 'approved' },
    ],
    bannedIn: ['usa', 'canada'],
    restrictedIn: [],
  },

  E952: {
    code: 'E952',
    regulations: [
      { jurisdiction: 'usa', status: 'banned', notes: 'Banned since 1970' },
      { jurisdiction: 'eu', status: 'approved', maxLevel: '7 mg/kg ADI' },
      { jurisdiction: 'canada', status: 'approved', notes: 'As table-top sweetener only' },
      { jurisdiction: 'uk', status: 'approved' },
      { jurisdiction: 'australia', status: 'approved' },
    ],
    bannedIn: ['usa'],
    restrictedIn: ['canada'],
  },

  // ============================================
  // SOUTHAMPTON SIX - Warning Required in EU
  // ============================================

  E102: {
    code: 'E102',
    regulations: [
      { jurisdiction: 'usa', status: 'approved', notes: 'Listed as Yellow 5' },
      {
        jurisdiction: 'eu',
        status: 'warning_required',
        warningText: 'May have an adverse effect on activity and attention in children',
      },
      { jurisdiction: 'canada', status: 'approved' },
      { jurisdiction: 'uk', status: 'warning_required' },
      { jurisdiction: 'australia', status: 'approved' },
    ],
    bannedIn: [],
    restrictedIn: ['eu', 'uk'],
  },

  E104: {
    code: 'E104',
    regulations: [
      { jurisdiction: 'usa', status: 'banned' },
      {
        jurisdiction: 'eu',
        status: 'warning_required',
        warningText: 'May have an adverse effect on activity and attention in children',
      },
      { jurisdiction: 'canada', status: 'banned' },
      { jurisdiction: 'australia', status: 'banned' },
    ],
    bannedIn: ['usa', 'canada', 'australia'],
    restrictedIn: ['eu'],
  },

  E110: {
    code: 'E110',
    regulations: [
      { jurisdiction: 'usa', status: 'approved', notes: 'Listed as Yellow 6' },
      {
        jurisdiction: 'eu',
        status: 'warning_required',
        warningText: 'May have an adverse effect on activity and attention in children',
      },
      { jurisdiction: 'canada', status: 'approved' },
      { jurisdiction: 'uk', status: 'warning_required' },
      { jurisdiction: 'australia', status: 'approved' },
    ],
    bannedIn: [],
    restrictedIn: ['eu', 'uk'],
  },

  E122: {
    code: 'E122',
    regulations: [
      { jurisdiction: 'usa', status: 'banned' },
      {
        jurisdiction: 'eu',
        status: 'warning_required',
        warningText: 'May have an adverse effect on activity and attention in children',
      },
      { jurisdiction: 'canada', status: 'banned' },
      { jurisdiction: 'australia', status: 'approved' },
    ],
    bannedIn: ['usa', 'canada'],
    restrictedIn: ['eu'],
  },

  E124: {
    code: 'E124',
    regulations: [
      { jurisdiction: 'usa', status: 'banned' },
      {
        jurisdiction: 'eu',
        status: 'warning_required',
        warningText: 'May have an adverse effect on activity and attention in children',
      },
      { jurisdiction: 'canada', status: 'approved' },
      { jurisdiction: 'australia', status: 'approved' },
    ],
    bannedIn: ['usa'],
    restrictedIn: ['eu'],
  },

  E129: {
    code: 'E129',
    regulations: [
      { jurisdiction: 'usa', status: 'approved', notes: 'Listed as Red 40' },
      {
        jurisdiction: 'eu',
        status: 'warning_required',
        warningText: 'May have an adverse effect on activity and attention in children',
      },
      { jurisdiction: 'canada', status: 'approved' },
      { jurisdiction: 'uk', status: 'warning_required' },
      { jurisdiction: 'australia', status: 'approved' },
    ],
    bannedIn: [],
    restrictedIn: ['eu', 'uk'],
  },

  // ============================================
  // CALIFORNIA PROPOSITION 65
  // ============================================

  E150D: {
    code: 'E150D',
    regulations: [
      { jurisdiction: 'usa', status: 'approved' },
      { jurisdiction: 'eu', status: 'approved' },
      {
        jurisdiction: 'california',
        status: 'warning_required',
        warningText:
          'WARNING: This product contains a chemical known to the State of California to cause cancer',
        notes: 'Prop 65 warning required for 4-MEI content',
      },
    ],
    bannedIn: [],
    restrictedIn: ['california'],
  },

  // ============================================
  // NITRITES/NITRATES
  // ============================================

  E249: {
    code: 'E249',
    regulations: [
      { jurisdiction: 'usa', status: 'approved', notes: 'Limited to cured meats' },
      { jurisdiction: 'eu', status: 'approved', maxLevel: '150 mg/kg' },
      { jurisdiction: 'canada', status: 'approved' },
      { jurisdiction: 'australia', status: 'approved' },
    ],
    bannedIn: [],
    restrictedIn: [],
  },

  E250: {
    code: 'E250',
    regulations: [
      {
        jurisdiction: 'usa',
        status: 'approved',
        maxLevel: '200 ppm',
        notes: 'Limited to specific products',
      },
      { jurisdiction: 'eu', status: 'approved', maxLevel: '150 mg/kg' },
      { jurisdiction: 'canada', status: 'approved' },
      { jurisdiction: 'australia', status: 'approved' },
    ],
    bannedIn: [],
    restrictedIn: [],
  },

  // ============================================
  // OTHER NOTABLE REGULATORY DIFFERENCES
  // ============================================

  E131: {
    code: 'E131',
    regulations: [
      { jurisdiction: 'usa', status: 'banned' },
      { jurisdiction: 'eu', status: 'approved' },
      { jurisdiction: 'australia', status: 'banned' },
    ],
    bannedIn: ['usa', 'australia'],
    restrictedIn: [],
  },

  E173: {
    code: 'E173',
    regulations: [
      { jurisdiction: 'usa', status: 'approved', notes: 'Limited to specific uses' },
      { jurisdiction: 'eu', status: 'approved', notes: 'Decorative coatings only' },
      { jurisdiction: 'australia', status: 'approved' },
    ],
    bannedIn: [],
    restrictedIn: [],
  },

  E951: {
    code: 'E951',
    regulations: [
      { jurisdiction: 'usa', status: 'approved', maxLevel: '50 mg/kg ADI' },
      { jurisdiction: 'eu', status: 'approved', maxLevel: '40 mg/kg ADI' },
      { jurisdiction: 'canada', status: 'approved' },
      { jurisdiction: 'australia', status: 'approved' },
    ],
    bannedIn: [],
    restrictedIn: [],
  },

  E955: {
    code: 'E955',
    regulations: [
      { jurisdiction: 'usa', status: 'approved' },
      { jurisdiction: 'eu', status: 'approved', maxLevel: '15 mg/kg ADI' },
      { jurisdiction: 'canada', status: 'approved' },
      { jurisdiction: 'australia', status: 'approved' },
    ],
    bannedIn: [],
    restrictedIn: [],
  },

  // BHA/BHT
  E320: {
    code: 'E320',
    regulations: [
      { jurisdiction: 'usa', status: 'approved', notes: 'Listed as potential carcinogen by NTP' },
      { jurisdiction: 'eu', status: 'restricted', maxLevel: '100-400 mg/kg depending on food' },
      { jurisdiction: 'california', status: 'approved', notes: 'Prop 65 listed' },
    ],
    bannedIn: [],
    restrictedIn: ['eu'],
  },

  E321: {
    code: 'E321',
    regulations: [
      { jurisdiction: 'usa', status: 'approved' },
      { jurisdiction: 'eu', status: 'restricted' },
      { jurisdiction: 'uk', status: 'restricted', notes: 'Limited to certain foods' },
      { jurisdiction: 'australia', status: 'restricted' },
    ],
    bannedIn: [],
    restrictedIn: ['eu', 'uk', 'australia'],
  },
};

/**
 * Get regulatory data for an additive.
 */
export function getAdditiveRegulatory(code: string): AdditiveRegulatoryData | null {
  const normalizedCode = code.toUpperCase().replace('-', '').replace(/\s/g, '');
  return ADDITIVE_REGULATORY_DATA[normalizedCode] || null;
}

/**
 * Check if an additive is banned in any jurisdiction.
 */
export function isBannedAnywhere(code: string): boolean {
  const data = getAdditiveRegulatory(code);
  return data ? data.bannedIn.length > 0 : false;
}

/**
 * Get the jurisdictions where an additive is banned.
 */
export function getBannedJurisdictions(code: string): RegulatoryJurisdiction[] {
  const data = getAdditiveRegulatory(code);
  return data ? data.bannedIn : [];
}

/**
 * Check if an additive requires a warning label in any jurisdiction.
 */
export function requiresWarningAnywhere(code: string): boolean {
  const data = getAdditiveRegulatory(code);
  if (!data) return false;

  return data.regulations.some((r) => r.status === 'warning_required');
}

/**
 * Get warning text for a specific jurisdiction.
 */
export function getWarningText(
  code: string,
  jurisdiction: RegulatoryJurisdiction
): string | null {
  const data = getAdditiveRegulatory(code);
  if (!data) return null;

  const reg = data.regulations.find((r) => r.jurisdiction === jurisdiction);
  return reg?.warningText || null;
}

/**
 * Get status in a specific jurisdiction.
 */
export function getStatusInJurisdiction(
  code: string,
  jurisdiction: RegulatoryJurisdiction
): RegulatoryInfo | null {
  const data = getAdditiveRegulatory(code);
  if (!data) return null;

  return data.regulations.find((r) => r.jurisdiction === jurisdiction) || null;
}

/**
 * Get all additives banned in a specific jurisdiction.
 */
export function getAdditivesBannedIn(
  jurisdiction: RegulatoryJurisdiction
): string[] {
  return Object.entries(ADDITIVE_REGULATORY_DATA)
    .filter(([, data]) => data.bannedIn.includes(jurisdiction))
    .map(([code]) => code);
}

/**
 * Compare regulatory status of an additive across all jurisdictions.
 */
export function compareRegulations(code: string): Array<{
  jurisdiction: RegulatoryJurisdiction;
  name: string;
  flag: string;
  status: RegulatoryStatus | 'unknown';
  notes?: string;
  warningText?: string;
}> {
  const data = getAdditiveRegulatory(code);
  const jurisdictions: RegulatoryJurisdiction[] = [
    'usa',
    'eu',
    'canada',
    'uk',
    'australia',
    'california',
  ];

  return jurisdictions.map((jurisdiction) => {
    const reg = data?.regulations.find((r) => r.jurisdiction === jurisdiction);
    return {
      jurisdiction,
      name: JURISDICTION_NAMES[jurisdiction],
      flag: JURISDICTION_FLAGS[jurisdiction],
      status: reg?.status || 'unknown',
      notes: reg?.notes,
      warningText: reg?.warningText,
    };
  });
}

/**
 * Check if regulatory data exists for an additive.
 */
export function hasRegulatoryData(code: string): boolean {
  return getAdditiveRegulatory(code) !== null;
}
