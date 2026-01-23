/**
 * LEGACY FILE - Redirects to new explanations folder
 *
 * This file is kept for backwards compatibility.
 * The comprehensive database has been expanded from 25 to 140+ additives.
 *
 * New code should import from './explanations' directly.
 */

export {
  ADDITIVE_EXPLANATIONS,
  getAdditiveExplanation,
  hasExplanation,
  getExplanationsByRisk,
  getExplanationCounts,
  searchExplanations,
  SAFE_ADDITIVE_EXPLANATIONS,
  MODERATE_ADDITIVE_EXPLANATIONS,
  AVOID_ADDITIVE_EXPLANATIONS,
} from './explanations';
