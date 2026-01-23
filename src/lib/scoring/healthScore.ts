import { Nutriments, ScoreBreakdown, ScoreDetail, ScoringConfig } from '@/types';
import { analyzeAdditives } from './additives';

const DEFAULT_CONFIG: ScoringConfig = {
  weights: {
    sugar: 15,
    saturatedFat: 15,
    sodium: 10,
    calories: 10,
    fiber: 10,
    protein: 10,
    additives: 15,
    organic: 5,
    processing: 10,
  },
  thresholds: {
    sugar: { low: 5, medium: 12.5, high: 22.5 }, // g per 100g
    saturatedFat: { low: 1.5, medium: 3, high: 5 }, // g per 100g
    sodium: { low: 0.3, medium: 0.6, high: 1.2 }, // g per 100g (salt/2.5)
    calories: { low: 100, medium: 200, high: 400 }, // kcal per 100g
    fiber: { low: 1.5, medium: 3, high: 6 }, // g per 100g
    protein: { low: 3, medium: 6, high: 12 }, // g per 100g
  },
};

interface ScoreInput {
  nutriments: Nutriments;
  additives: string[];
  novaGroup?: number;
  labels: string[];
}

export function calculateHealthScore(input: ScoreInput): {
  score: number;
  breakdown: ScoreBreakdown;
} {
  const { nutriments, additives, novaGroup, labels } = input;
  const details: ScoreDetail[] = [];
  let positivePoints = 0;
  let negativePoints = 0;

  // Sugar analysis (negative)
  const sugarScore = analyzeNutrient(
    'sugar',
    nutriments.sugars_100g,
    DEFAULT_CONFIG.thresholds.sugar,
    DEFAULT_CONFIG.weights.sugar,
    true
  );
  if (sugarScore) {
    details.push(sugarScore);
    negativePoints += Math.abs(sugarScore.points);
  }

  // Saturated fat analysis (negative)
  const satFatScore = analyzeNutrient(
    'saturated fat',
    nutriments['saturated-fat_100g'],
    DEFAULT_CONFIG.thresholds.saturatedFat,
    DEFAULT_CONFIG.weights.saturatedFat,
    true
  );
  if (satFatScore) {
    details.push(satFatScore);
    negativePoints += Math.abs(satFatScore.points);
  }

  // Sodium analysis (negative)
  const sodiumValue = nutriments.sodium_100g || (nutriments.salt_100g ? nutriments.salt_100g / 2.5 : undefined);
  const sodiumScore = analyzeNutrient(
    'sodium',
    sodiumValue,
    DEFAULT_CONFIG.thresholds.sodium,
    DEFAULT_CONFIG.weights.sodium,
    true
  );
  if (sodiumScore) {
    details.push(sodiumScore);
    negativePoints += Math.abs(sodiumScore.points);
  }

  // Calories analysis (negative)
  const caloriesValue = nutriments['energy-kcal_100g'] || (nutriments.energy_100g ? nutriments.energy_100g / 4.184 : undefined);
  const caloriesScore = analyzeNutrient(
    'calories',
    caloriesValue,
    DEFAULT_CONFIG.thresholds.calories,
    DEFAULT_CONFIG.weights.calories,
    true
  );
  if (caloriesScore) {
    details.push(caloriesScore);
    negativePoints += Math.abs(caloriesScore.points);
  }

  // Fiber analysis (positive)
  const fiberScore = analyzeNutrient(
    'fiber',
    nutriments.fiber_100g,
    DEFAULT_CONFIG.thresholds.fiber,
    DEFAULT_CONFIG.weights.fiber,
    false
  );
  if (fiberScore) {
    details.push(fiberScore);
    positivePoints += fiberScore.points;
  }

  // Protein analysis (positive)
  const proteinScore = analyzeNutrient(
    'protein',
    nutriments.proteins_100g,
    DEFAULT_CONFIG.thresholds.protein,
    DEFAULT_CONFIG.weights.protein,
    false
  );
  if (proteinScore) {
    details.push(proteinScore);
    positivePoints += proteinScore.points;
  }

  // Additives analysis (negative)
  const additiveAnalysis = analyzeAdditives(additives);
  const additiveScore = calculateAdditiveScore(additiveAnalysis, DEFAULT_CONFIG.weights.additives);
  if (additiveScore) {
    details.push(additiveScore);
    negativePoints += Math.abs(additiveScore.points);
  }

  // NOVA processing level (negative)
  const novaScore = calculateNovaScore(novaGroup, DEFAULT_CONFIG.weights.processing);
  if (novaScore) {
    details.push(novaScore);
    negativePoints += Math.abs(novaScore.points);
  }

  // Organic bonus (positive)
  const organicScore = calculateOrganicBonus(labels, DEFAULT_CONFIG.weights.organic);
  if (organicScore) {
    details.push(organicScore);
    positivePoints += organicScore.points;
  }

  // Calculate final score (0-100)
  const maxNegative =
    DEFAULT_CONFIG.weights.sugar +
    DEFAULT_CONFIG.weights.saturatedFat +
    DEFAULT_CONFIG.weights.sodium +
    DEFAULT_CONFIG.weights.calories +
    DEFAULT_CONFIG.weights.additives +
    DEFAULT_CONFIG.weights.processing;

  const maxPositive =
    DEFAULT_CONFIG.weights.fiber +
    DEFAULT_CONFIG.weights.protein +
    DEFAULT_CONFIG.weights.organic;

  // Start at 50, add positive points, subtract negative points
  // Scale to ensure score is between 0 and 100
  const baseScore = 50;
  const positiveBonus = (positivePoints / maxPositive) * 25; // Max +25 points
  const negativePenalty = (negativePoints / maxNegative) * 50; // Max -50 points

  let finalScore = Math.round(baseScore + positiveBonus - negativePenalty);
  finalScore = Math.max(0, Math.min(100, finalScore));

  return {
    score: finalScore,
    breakdown: {
      positivePoints,
      negativePoints,
      details,
    },
  };
}

function analyzeNutrient(
  name: string,
  value: number | undefined,
  thresholds: { low: number; medium: number; high: number },
  weight: number,
  isNegative: boolean
): ScoreDetail | null {
  if (value === undefined || value === null) {
    return null;
  }

  let points: number;
  let description: string;

  if (isNegative) {
    // For negative nutrients (sugar, fat, sodium): higher is worse
    if (value <= thresholds.low) {
      points = 0;
      description = `Low ${name}: ${value.toFixed(1)}g/100g (excellent)`;
    } else if (value <= thresholds.medium) {
      points = -Math.round((value - thresholds.low) / (thresholds.medium - thresholds.low) * (weight / 2));
      description = `Moderate ${name}: ${value.toFixed(1)}g/100g`;
    } else if (value <= thresholds.high) {
      points = -Math.round((weight / 2) + (value - thresholds.medium) / (thresholds.high - thresholds.medium) * (weight / 2));
      description = `High ${name}: ${value.toFixed(1)}g/100g (caution)`;
    } else {
      points = -weight;
      description = `Very high ${name}: ${value.toFixed(1)}g/100g (excessive)`;
    }
  } else {
    // For positive nutrients (fiber, protein): higher is better
    if (value >= thresholds.high) {
      points = weight;
      description = `Excellent ${name}: ${value.toFixed(1)}g/100g`;
    } else if (value >= thresholds.medium) {
      points = Math.round((weight / 2) + (value - thresholds.medium) / (thresholds.high - thresholds.medium) * (weight / 2));
      description = `Good ${name}: ${value.toFixed(1)}g/100g`;
    } else if (value >= thresholds.low) {
      points = Math.round((value - thresholds.low) / (thresholds.medium - thresholds.low) * (weight / 2));
      description = `Moderate ${name}: ${value.toFixed(1)}g/100g`;
    } else {
      points = 0;
      description = `Low ${name}: ${value.toFixed(1)}g/100g`;
    }
  }

  return {
    factor: name,
    points,
    description,
    type: isNegative ? 'negative' : 'positive',
  };
}

function calculateAdditiveScore(
  analysis: { safe: unknown[]; moderate: unknown[]; avoid: unknown[]; unknown: string[] },
  weight: number
): ScoreDetail | null {
  const avoidCount = analysis.avoid.length;
  const moderateCount = analysis.moderate.length;
  const unknownCount = analysis.unknown.length;

  if (avoidCount === 0 && moderateCount === 0 && unknownCount === 0) {
    return {
      factor: 'additives',
      points: 0,
      description: 'No concerning additives found',
      type: 'negative',
    };
  }

  // Penalty calculation
  const avoidPenalty = avoidCount * (weight / 3);
  const moderatePenalty = moderateCount * (weight / 10);
  const unknownPenalty = unknownCount * (weight / 15);

  const totalPenalty = Math.min(weight, Math.round(avoidPenalty + moderatePenalty + unknownPenalty));

  let description: string;
  if (avoidCount > 0) {
    description = `Contains ${avoidCount} additive(s) to avoid`;
  } else if (moderateCount > 0) {
    description = `Contains ${moderateCount} additive(s) with moderate risk`;
  } else {
    description = `Contains ${unknownCount} unknown additive(s)`;
  }

  return {
    factor: 'additives',
    points: -totalPenalty,
    description,
    type: 'negative',
  };
}

function calculateNovaScore(novaGroup: number | undefined, weight: number): ScoreDetail | null {
  if (!novaGroup || novaGroup < 1 || novaGroup > 4) {
    return null;
  }

  const descriptions = {
    1: 'Unprocessed or minimally processed',
    2: 'Processed culinary ingredients',
    3: 'Processed foods',
    4: 'Ultra-processed foods',
  };

  const penalties = {
    1: 0,
    2: Math.round(weight * 0.2),
    3: Math.round(weight * 0.5),
    4: weight,
  };

  return {
    factor: 'processing',
    points: -penalties[novaGroup as keyof typeof penalties],
    description: `NOVA ${novaGroup}: ${descriptions[novaGroup as keyof typeof descriptions]}`,
    type: 'negative',
  };
}

function calculateOrganicBonus(labels: string[], weight: number): ScoreDetail | null {
  const organicLabels = ['organic', 'bio', 'usda organic', 'eu organic', 'ab agriculture biologique'];
  const hasOrganic = labels.some((label) =>
    organicLabels.some((organic) => label.toLowerCase().includes(organic))
  );

  if (hasOrganic) {
    return {
      factor: 'organic',
      points: weight,
      description: 'Organic certification bonus',
      type: 'positive',
    };
  }

  return null;
}

// Note: getScoreColor and getScoreLabel are now in ScoreGauge component
// Re-export for backward compatibility
export { getScoreColor, getScoreLabel } from '@/components/product/ScoreGauge';

export function getNutriScoreColor(grade: string): string {
  const colors: Record<string, string> = {
    A: '#038141',
    B: '#85BB2F',
    C: '#FECB02',
    D: '#EE8100',
    E: '#E63E11',
  };
  return colors[grade.toUpperCase()] || '#9ca3af';
}
