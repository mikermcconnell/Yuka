import type { PersonalizedNutriScoreModifiers } from '@/types';

/**
 * Personalized NutriScore modifiers based on genetic profiles.
 * These apply small point adjustments to the NutriScore calculation
 * rather than replacing the entire scoring config.
 *
 * Keyed by user email address.
 */
const PERSONALIZED_MODIFIERS: Record<string, PersonalizedNutriScoreModifiers> = {
  /**
   * Michael McConnell's personalized modifiers
   * Based on 23andMe genetic analysis (January 2026)
   *
   * - APOA2 AA: Highly sensitive to saturated fat → extra N points for high sat fat
   * - TCF7L2 CC: Favorable carb metabolism → slight N reduction for low sugar
   * - CYP11B2 GG: Not salt-sensitive → slight N reduction for low salt
   */
  'michaelryanmcconnell@gmail.com': {
    adjustN: (N, nutriments) => {
      let adjusted = N;

      // APOA2 AA: Saturated fat sensitivity — add extra negative points
      const satFat = nutriments['saturated-fat_100g'] ?? 0;
      if (satFat > 6) adjusted += 3;
      else if (satFat > 4) adjusted += 2;
      else if (satFat > 2) adjusted += 1;

      // TCF7L2 CC: Favorable carb metabolism — reduce penalty for low sugar
      const sugar = nutriments.sugars_100g ?? 0;
      if (sugar <= 15) adjusted = Math.max(0, adjusted - 1);

      // CYP11B2 GG: Not salt-sensitive — reduce penalty for low salt
      const salt = nutriments.salt_100g ?? 0;
      if (salt <= 1.5) adjusted = Math.max(0, adjusted - 1);

      return adjusted;
    },
    adjustP: (P) => P, // No positive point adjustments
  },
};

/**
 * Get personalized NutriScore modifiers for a user, or null if none exists.
 */
export function getPersonalizedModifiers(
  userEmail: string | null | undefined
): PersonalizedNutriScoreModifiers | null {
  if (!userEmail) return null;

  const normalizedEmail = userEmail.toLowerCase().trim();
  return PERSONALIZED_MODIFIERS[normalizedEmail] || null;
}

/**
 * Check if a user has personalized scoring enabled.
 */
export function hasPersonalizedScoring(userEmail: string | null | undefined): boolean {
  return getPersonalizedModifiers(userEmail) !== null;
}
