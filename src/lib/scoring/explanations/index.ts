import { AdditiveExplanation } from '@/types';
import { SAFE_ADDITIVE_EXPLANATIONS } from './safe-additives';
import { MODERATE_ADDITIVE_EXPLANATIONS } from './moderate-additives';
import { AVOID_ADDITIVE_EXPLANATIONS } from './avoid-additives';

/**
 * Complete Additive Explanations Database (Feature 1)
 *
 * Merges all additive explanations from the three risk categories.
 * Provides ~140 comprehensive explanations covering the full additive database.
 */

// Merge all explanations into a single record
export const ADDITIVE_EXPLANATIONS: Record<string, AdditiveExplanation> = {
  ...SAFE_ADDITIVE_EXPLANATIONS,
  ...MODERATE_ADDITIVE_EXPLANATIONS,
  ...AVOID_ADDITIVE_EXPLANATIONS,
};

/**
 * Get detailed explanation for an additive.
 *
 * @param code - The additive code (e.g., 'E300', 'e300', 'E-300')
 * @returns AdditiveExplanation or null if not found
 */
export function getAdditiveExplanation(code: string): AdditiveExplanation | null {
  const normalizedCode = code.toUpperCase().replace('-', '').replace(/\s/g, '');
  return ADDITIVE_EXPLANATIONS[normalizedCode] || null;
}

/**
 * Check if an additive has a detailed explanation available.
 */
export function hasExplanation(code: string): boolean {
  return getAdditiveExplanation(code) !== null;
}

/**
 * Get all explanations for a specific risk level.
 */
export function getExplanationsByRisk(
  risk: 'safe' | 'moderate' | 'avoid'
): AdditiveExplanation[] {
  return Object.values(ADDITIVE_EXPLANATIONS).filter((exp) => exp.risk === risk);
}

/**
 * Get the total count of explanations by risk level.
 */
export function getExplanationCounts(): {
  safe: number;
  moderate: number;
  avoid: number;
  total: number;
} {
  const safe = Object.values(SAFE_ADDITIVE_EXPLANATIONS).length;
  const moderate = Object.values(MODERATE_ADDITIVE_EXPLANATIONS).length;
  const avoid = Object.values(AVOID_ADDITIVE_EXPLANATIONS).length;

  return {
    safe,
    moderate,
    avoid,
    total: safe + moderate + avoid,
  };
}

/**
 * Search explanations by keyword in name, common name, or description.
 */
export function searchExplanations(query: string): AdditiveExplanation[] {
  const lowerQuery = query.toLowerCase();

  return Object.values(ADDITIVE_EXPLANATIONS).filter((exp) => {
    return (
      exp.name.toLowerCase().includes(lowerQuery) ||
      exp.commonName?.toLowerCase().includes(lowerQuery) ||
      exp.function.toLowerCase().includes(lowerQuery) ||
      exp.whyThisRating.toLowerCase().includes(lowerQuery) ||
      exp.code.toLowerCase().includes(lowerQuery)
    );
  });
}

// Re-export individual category explanations for direct access if needed
export { SAFE_ADDITIVE_EXPLANATIONS } from './safe-additives';
export { MODERATE_ADDITIVE_EXPLANATIONS } from './moderate-additives';
export { AVOID_ADDITIVE_EXPLANATIONS } from './avoid-additives';
