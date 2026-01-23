import { ScoringConfig } from '@/types';

/**
 * Personalized scoring configurations based on genetic profiles.
 * Keyed by user email address.
 */
export const PERSONALIZED_CONFIGS: Record<string, ScoringConfig> = {
  /**
   * Michael McConnell's personalized thresholds
   * Based on 23andMe genetic analysis (January 2026)
   *
   * Key genetic factors:
   * - APOA2 AA: Highly sensitive to saturated fat (stricter thresholds)
   * - TCF7L2 CC, GCKR CC: Favorable carb metabolism (more permissive sugar)
   * - CYP11B2 GG: Not salt-sensitive (slightly more permissive sodium)
   * - FTO TT: Protective obesity variant (less calorie penalty)
   * - 9p21 cardiovascular variants: Benefits from omega-3s
   * - MTHFR A1298C: Benefits from fiber-rich/folate foods
   * - ACTN3 XX: Endurance athlete, higher protein needs
   */
  'michaelryanmcconnell@gmail.com': {
    weights: {
      sugar: 12,        // Decreased from 15 (favorable carb genetics TCF7L2 CC)
      saturatedFat: 20, // INCREASED from 15 (APOA2 AA - critical sensitivity)
      sodium: 8,        // Decreased from 10 (CYP11B2 GG - not salt-sensitive)
      calories: 5,      // Decreased from 10 (FTO TT protective variant)
      fiber: 12,        // Increased from 10 (MTHFR support, cardiovascular)
      protein: 10,      // Unchanged (active lifestyle needs)
      omega3: 8,        // NEW (9p21 cardiovascular, CETP AA HDL support)
      additives: 15,    // Unchanged
      organic: 5,       // Unchanged
      processing: 10,   // Unchanged
    },
    thresholds: {
      sugar: { low: 6, medium: 15, high: 25 },           // More permissive (favorable carb genetics)
      saturatedFat: { low: 1.0, medium: 2.0, high: 3.5 }, // STRICTER (APOA2 AA sensitivity)
      sodium: { low: 0.4, medium: 0.8, high: 1.5 },      // Slightly more permissive
      calories: { low: 150, medium: 300, high: 500 },    // More permissive (FTO protective)
      fiber: { low: 2, medium: 4, high: 7 },             // Slightly higher bar
      protein: { low: 4, medium: 8, high: 15 },          // Higher bar for active lifestyle
      omega3: { low: 0.1, medium: 0.5, high: 1.5 },      // NEW threshold
    },
  },
};

/**
 * Get personalized scoring config for a user, or null if none exists.
 */
export function getPersonalizedConfig(userEmail: string | null | undefined): ScoringConfig | null {
  if (!userEmail) return null;

  const normalizedEmail = userEmail.toLowerCase().trim();
  return PERSONALIZED_CONFIGS[normalizedEmail] || null;
}

/**
 * Check if a user has personalized scoring enabled.
 */
export function hasPersonalizedScoring(userEmail: string | null | undefined): boolean {
  return getPersonalizedConfig(userEmail) !== null;
}
