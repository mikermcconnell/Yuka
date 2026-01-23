import { AdditiveLoadScore, AdditiveLoadBreakdown, ProcessingLevel } from '@/types';
import { analyzeAdditives } from './additives';

/**
 * Cumulative Additive Load Score (Feature 5)
 *
 * Calculates a weighted score based on the number and risk level of additives.
 * Higher scores indicate more processing and potential health concerns.
 */

// Risk weights for calculating the cumulative score
const RISK_WEIGHTS = {
  safe: 1,
  moderate: 3,
  avoid: 5,
  unknown: 2,
};

// Processing level thresholds based on weighted score
const PROCESSING_THRESHOLDS = {
  minimal: { max: 5 },
  low: { max: 15 },
  moderate: { max: 30 },
  high: { max: 50 },
  ultra: { max: Infinity },
};

/**
 * Calculate the cumulative additive load score for a product.
 *
 * @param additives - Array of additive codes (e.g., ['E300', 'E211', 'E150D'])
 * @returns AdditiveLoadScore with weighted score and processing level
 */
export function calculateAdditiveLoad(additives: string[]): AdditiveLoadScore {
  if (additives.length === 0) {
    return {
      totalCount: 0,
      weightedScore: 0,
      processingLevel: 'minimal',
      breakdown: {
        safeCount: 0,
        moderateCount: 0,
        avoidCount: 0,
        unknownCount: 0,
      },
    };
  }

  const analysis = analyzeAdditives(additives);

  const breakdown: AdditiveLoadBreakdown = {
    safeCount: analysis.safe.length,
    moderateCount: analysis.moderate.length,
    avoidCount: analysis.avoid.length,
    unknownCount: analysis.unknown.length,
  };

  // Calculate weighted score
  const weightedScore =
    breakdown.safeCount * RISK_WEIGHTS.safe +
    breakdown.moderateCount * RISK_WEIGHTS.moderate +
    breakdown.avoidCount * RISK_WEIGHTS.avoid +
    breakdown.unknownCount * RISK_WEIGHTS.unknown;

  // Determine processing level
  const processingLevel = getProcessingLevel(weightedScore);

  return {
    totalCount: additives.length,
    weightedScore,
    processingLevel,
    breakdown,
  };
}

/**
 * Determine the processing level based on weighted score.
 */
function getProcessingLevel(weightedScore: number): ProcessingLevel {
  if (weightedScore <= PROCESSING_THRESHOLDS.minimal.max) return 'minimal';
  if (weightedScore <= PROCESSING_THRESHOLDS.low.max) return 'low';
  if (weightedScore <= PROCESSING_THRESHOLDS.moderate.max) return 'moderate';
  if (weightedScore <= PROCESSING_THRESHOLDS.high.max) return 'high';
  return 'ultra';
}

/**
 * Get display information for a processing level.
 */
export function getProcessingLevelInfo(level: ProcessingLevel): {
  label: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
} {
  const levelInfo: Record<
    ProcessingLevel,
    { label: string; description: string; color: string; bgColor: string; borderColor: string }
  > = {
    minimal: {
      label: 'Minimally Processed',
      description: 'Few or no additives, closest to whole foods',
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    low: {
      label: 'Low Processing',
      description: 'Some safe additives, minimal concerns',
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
    },
    moderate: {
      label: 'Moderately Processed',
      description: 'Several additives, some may warrant attention',
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    high: {
      label: 'Highly Processed',
      description: 'Many additives including concerning ones',
      color: 'text-orange-700',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    ultra: {
      label: 'Ultra-Processed',
      description: 'Extensive use of additives, significant concerns',
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
  };

  return levelInfo[level];
}

/**
 * Calculate a normalized score (0-100) for UI display.
 * Score of 0 = best (minimal processing), 100 = worst (ultra-processed)
 */
export function getNormalizedLoadScore(loadScore: AdditiveLoadScore): number {
  // Cap at 100 for display purposes
  // A score of 50+ is "ultra" processed, so we normalize to that range
  const maxScore = 60; // Anything above this is essentially 100%
  const normalized = Math.min((loadScore.weightedScore / maxScore) * 100, 100);
  return Math.round(normalized);
}

/**
 * Get a descriptive summary of the additive load.
 */
export function getAdditiveLoadSummary(loadScore: AdditiveLoadScore): string {
  const { totalCount, breakdown, processingLevel } = loadScore;

  if (totalCount === 0) {
    return 'No additives detected - this appears to be a whole food or minimally processed product.';
  }

  const parts: string[] = [];

  if (breakdown.avoidCount > 0) {
    parts.push(`${breakdown.avoidCount} additive${breakdown.avoidCount > 1 ? 's' : ''} to avoid`);
  }
  if (breakdown.moderateCount > 0) {
    parts.push(
      `${breakdown.moderateCount} moderate-risk additive${breakdown.moderateCount > 1 ? 's' : ''}`
    );
  }
  if (breakdown.safeCount > 0) {
    parts.push(`${breakdown.safeCount} safe additive${breakdown.safeCount > 1 ? 's' : ''}`);
  }
  if (breakdown.unknownCount > 0) {
    parts.push(`${breakdown.unknownCount} unknown additive${breakdown.unknownCount > 1 ? 's' : ''}`);
  }

  const levelInfo = getProcessingLevelInfo(processingLevel);
  return `${levelInfo.label}: ${parts.join(', ')}.`;
}
