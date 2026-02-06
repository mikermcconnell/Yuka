import { Nutriments, ScoreBreakdown, ScoreDetail, ScoringConfig } from '@/types';
import { analyzeAdditives } from './additives';
import { getPersonalizedConfig } from './personalizedConfigs';
import { calculateAdditiveLoad } from './additiveLoad';
import { detectInteractions } from './additiveInteractions';

const DEFAULT_CONFIG: ScoringConfig = {
  weights: {
    sugar: 20,
    saturatedFat: 15,
    sodium: 10,
    calories: 10,
    fiber: 10,
    protein: 10,
    omega3: 0, // Not used in default scoring, only for personalized profiles
    additives: 20,
    organic: 5,
    processing: 25, // Increased from 10 - ultra-processed foods are a major health concern
  },
  thresholds: {
    sugar: { low: 5, medium: 12.5, high: 22.5 }, // g per 100g
    saturatedFat: { low: 1.5, medium: 3, high: 5 }, // g per 100g
    sodium: { low: 0.3, medium: 0.6, high: 1.2 }, // g per 100g (salt/2.5)
    calories: { low: 100, medium: 200, high: 400 }, // kcal per 100g
    fiber: { low: 1.5, medium: 3, high: 6 }, // g per 100g
    protein: { low: 3, medium: 6, high: 12 }, // g per 100g
    omega3: { low: 0.1, medium: 0.5, high: 1.5 }, // g per 100g (for personalized profiles)
  },
};

// Stricter thresholds for beverages - liquid calories and sugars are worse
const BEVERAGE_CONFIG: ScoringConfig = {
  weights: {
    sugar: 30, // Very high weight - sugary drinks are particularly harmful to health
    saturatedFat: 10,
    sodium: 5,
    calories: 15, // Higher weight - liquid calories don't satiate
    fiber: 5,
    protein: 5,
    omega3: 0,
    additives: 20,
    organic: 5,
    processing: 20,
  },
  thresholds: {
    sugar: { low: 2.5, medium: 5, high: 8 }, // Even stricter - 8g/100ml is very high for a drink
    saturatedFat: { low: 1, medium: 2, high: 4 },
    sodium: { low: 0.1, medium: 0.3, high: 0.6 },
    calories: { low: 15, medium: 30, high: 50 }, // Stricter - 50 kcal/100ml is a lot for a beverage
    fiber: { low: 0.5, medium: 1, high: 2 },
    protein: { low: 1, medium: 3, high: 6 },
    omega3: { low: 0.1, medium: 0.5, high: 1.5 },
  },
};

// Categories that indicate a product is a beverage
const BEVERAGE_CATEGORIES = [
  'beverages', 'drinks', 'sodas', 'soft drinks', 'carbonated drinks',
  'juices', 'fruit juices', 'vegetable juices', 'nectars',
  'waters', 'flavored waters', 'sparkling waters',
  'energy drinks', 'sports drinks', 'isotonic drinks',
  'teas', 'iced teas', 'tea drinks',
  'coffees', 'coffee drinks', 'iced coffees',
  'milks', 'plant milks', 'dairy drinks', 'milk drinks',
  'smoothies', 'shakes', 'protein drinks',
  'lemonades', 'colas', 'ginger ales',
];

interface ScoreInput {
  nutriments: Nutriments;
  additives: string[];
  novaGroup?: number;
  labels: string[];
  categories?: string[]; // For beverage detection
  userEmail?: string | null; // For personalized scoring based on genetic profile
}

// Detect if product is a beverage based on categories
function isBeverage(categories: string[]): boolean {
  const lowerCategories = categories.map(c => c.toLowerCase());
  return lowerCategories.some(cat =>
    BEVERAGE_CATEGORIES.some(bev => cat.includes(bev))
  );
}

function mergeBeveragePersonalizedConfig(
  personalizedConfig: ScoringConfig | null,
  isBeverageProduct: boolean
): ScoringConfig {
  if (!personalizedConfig && !isBeverageProduct) {
    return DEFAULT_CONFIG;
  }

  if (!personalizedConfig && isBeverageProduct) {
    return BEVERAGE_CONFIG;
  }

  if (personalizedConfig && !isBeverageProduct) {
    return personalizedConfig;
  }

  const p = personalizedConfig as ScoringConfig;
  const b = BEVERAGE_CONFIG;

  return {
    weights: {
      sugar: Math.max(p.weights.sugar, b.weights.sugar),
      saturatedFat: Math.max(p.weights.saturatedFat, b.weights.saturatedFat),
      sodium: Math.max(p.weights.sodium, b.weights.sodium),
      calories: Math.max(p.weights.calories, b.weights.calories),
      fiber: Math.min(p.weights.fiber, b.weights.fiber),
      protein: Math.min(p.weights.protein, b.weights.protein),
      omega3: p.weights.omega3,
      additives: Math.max(p.weights.additives, b.weights.additives),
      organic: p.weights.organic,
      processing: Math.max(p.weights.processing, b.weights.processing),
    },
    thresholds: {
      // Use stricter beverage thresholds for liquid products.
      sugar: b.thresholds.sugar,
      saturatedFat: b.thresholds.saturatedFat,
      sodium: b.thresholds.sodium,
      calories: b.thresholds.calories,
      fiber: b.thresholds.fiber,
      protein: b.thresholds.protein,
      omega3: p.thresholds.omega3,
    },
  };
}

// Calculate empty calorie penalty for products with calories but no nutritional value
function calculateEmptyCaloriePenalty(
  nutriments: Nutriments,
  isBeverageProduct: boolean
): ScoreDetail | null {
  const sugar = nutriments.sugars_100g || 0;
  const fiber = nutriments.fiber_100g || 0;
  const protein = nutriments.proteins_100g || 0;
  const calories = nutriments['energy-kcal_100g'] || (nutriments.energy_100g ? nutriments.energy_100g / 4.184 : 0);

  // Empty calories: has sugar/calories but no fiber AND no protein
  const hasEmptyCalories = (sugar > 5 || calories > 50) && fiber < 0.5 && protein < 1;

  if (!hasEmptyCalories) {
    return null;
  }

  // Calculate penalty severity based on how "empty" the calories are
  // Beverages with high sugar and no nutrition get maximum penalty
  let penalty: number;
  let description: string;

  if (isBeverageProduct && sugar > 8) {
    // Sugary drinks like soda - very harsh penalty
    penalty = 30;
    description = 'Sugary beverage with no nutritional value';
  } else if (isBeverageProduct) {
    penalty = 20;
    description = 'Beverage with minimal nutritional value';
  } else if (sugar > 15) {
    // Very high sugar foods with no nutrition
    penalty = 20;
    description = 'High sugar with minimal nutritional value';
  } else {
    penalty = 15;
    description = 'Contains calories with minimal nutritional value (no fiber or protein)';
  }

  return {
    factor: 'empty calories',
    points: -penalty,
    description,
    type: 'negative',
  };
}

export function calculateHealthScore(input: ScoreInput): {
  score: number;
  breakdown: ScoreBreakdown;
  isPersonalized: boolean;
} {
  const { nutriments, additives, novaGroup, labels, categories = [], userEmail } = input;
  const details: ScoreDetail[] = [];
  let positivePoints = 0;
  let negativePoints = 0;
  let maxPositive = 0;
  let maxNegative = 0;

  // Detect if product is a beverage for stricter scoring
  const isBeverageProduct = isBeverage(categories);

  // Merge beverage strictness with personalized settings when both apply.
  const personalizedConfig = getPersonalizedConfig(userEmail);
  const config = mergeBeveragePersonalizedConfig(personalizedConfig, isBeverageProduct);
  const isPersonalized = personalizedConfig !== null;

  // Sugar analysis (negative)
  const sugarScore = analyzeNutrient(
    'sugar',
    nutriments.sugars_100g,
    config.thresholds.sugar,
    config.weights.sugar,
    true
  );
  if (sugarScore) {
    details.push(sugarScore);
    negativePoints += Math.abs(sugarScore.points);
    maxNegative += config.weights.sugar;
  }

  // Saturated fat analysis (negative)
  const satFatScore = analyzeNutrient(
    'saturated fat',
    nutriments['saturated-fat_100g'],
    config.thresholds.saturatedFat,
    config.weights.saturatedFat,
    true
  );
  if (satFatScore) {
    details.push(satFatScore);
    negativePoints += Math.abs(satFatScore.points);
    maxNegative += config.weights.saturatedFat;
  }

  // Sodium analysis (negative)
  const sodiumValue = nutriments.sodium_100g || (nutriments.salt_100g ? nutriments.salt_100g / 2.5 : undefined);
  const sodiumScore = analyzeNutrient(
    'sodium',
    sodiumValue,
    config.thresholds.sodium,
    config.weights.sodium,
    true
  );
  if (sodiumScore) {
    details.push(sodiumScore);
    negativePoints += Math.abs(sodiumScore.points);
    maxNegative += config.weights.sodium;
  }

  // Calories analysis (negative)
  const caloriesValue = nutriments['energy-kcal_100g'] || (nutriments.energy_100g ? nutriments.energy_100g / 4.184 : undefined);
  const caloriesScore = analyzeNutrient(
    'calories',
    caloriesValue,
    config.thresholds.calories,
    config.weights.calories,
    true
  );
  if (caloriesScore) {
    details.push(caloriesScore);
    negativePoints += Math.abs(caloriesScore.points);
    maxNegative += config.weights.calories;
  }

  // Fiber analysis (positive)
  const fiberScore = analyzeNutrient(
    'fiber',
    nutriments.fiber_100g,
    config.thresholds.fiber,
    config.weights.fiber,
    false
  );
  if (fiberScore) {
    details.push(fiberScore);
    positivePoints += fiberScore.points;
    maxPositive += config.weights.fiber;
  }

  // Protein analysis (positive)
  const proteinScore = analyzeNutrient(
    'protein',
    nutriments.proteins_100g,
    config.thresholds.protein,
    config.weights.protein,
    false
  );
  if (proteinScore) {
    details.push(proteinScore);
    positivePoints += proteinScore.points;
    maxPositive += config.weights.protein;
  }

  // Omega-3 analysis (positive) - only for personalized profiles with omega3 weight > 0
  if (config.weights.omega3 > 0) {
    // OpenFoodFacts stores omega-3 as omega-3-fat_100g
    const omega3Value = nutriments['omega-3-fat_100g'];
    const omega3Score = analyzeNutrient(
      'omega-3',
      omega3Value,
      config.thresholds.omega3,
      config.weights.omega3,
      false
    );
    if (omega3Score) {
      details.push(omega3Score);
      positivePoints += omega3Score.points;
      maxPositive += config.weights.omega3;
    }
  }

  // Additives analysis (negative)
  const additiveAnalysis = analyzeAdditives(additives);
  const additiveScore = calculateAdditiveScore(additiveAnalysis, config.weights.additives);
  if (additiveScore) {
    details.push(additiveScore);
    negativePoints += Math.abs(additiveScore.points);
    maxNegative += getAdditivePenaltyCap(config.weights.additives);
  }

  // Additive interaction penalty (negative)
  const interactionScore = calculateInteractionPenalty(additives);
  if (interactionScore) {
    details.push(interactionScore);
    negativePoints += Math.abs(interactionScore.points);
    maxNegative += getInteractionPenaltyCap();
  }

  // NOVA processing level (negative), with additive-based fallback if NOVA is missing
  const processingScore = calculateProcessingScore(novaGroup, additives, config.weights.processing);
  details.push(processingScore);
  negativePoints += Math.abs(processingScore.points);
  maxNegative += config.weights.processing;

  // Organic bonus (positive)
  const organicScore = calculateOrganicBonus(labels, config.weights.organic);
  if (organicScore) {
    details.push(organicScore);
    positivePoints += organicScore.points;
  }
  if (labels.length > 0) {
    maxPositive += config.weights.organic;
  }

  // Empty calorie penalty (negative) - for products with calories but no nutritional value
  const emptyCalorieScore = calculateEmptyCaloriePenalty(nutriments, isBeverageProduct);
  if (emptyCalorieScore) {
    details.push(emptyCalorieScore);
    negativePoints += Math.abs(emptyCalorieScore.points);
    maxNegative += isBeverageProduct ? 30 : 20;
  }

  // Calculate final score (0-100)
  const baseScore = 100;
  const normalizedPositiveMax = Math.max(maxPositive, 1);
  const normalizedNegativeMax = Math.max(maxNegative, 1);
  const positiveBonus = (positivePoints / normalizedPositiveMax) * 15; // Max +15 points for nutritional value
  const negativePenalty = (negativePoints / normalizedNegativeMax) * 100; // Full penalty range - bad products can score 0

  let finalScore = Math.round(baseScore + positiveBonus - negativePenalty);
  finalScore = Math.max(0, Math.min(100, finalScore));

  return {
    score: finalScore,
    breakdown: {
      positivePoints,
      negativePoints,
      details,
    },
    isPersonalized,
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

  // Stricter additive penalty calculation
  const avoidPenalty = avoidCount * (weight / 2);
  const moderatePenalty = moderateCount * (weight / 5);
  const unknownPenalty = unknownCount * (weight / 6);

  const totalPenalty = Math.min(getAdditivePenaltyCap(weight), Math.round(avoidPenalty + moderatePenalty + unknownPenalty));

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

function calculateProcessingScore(
  novaGroup: number | undefined,
  additives: string[],
  weight: number
): ScoreDetail {
  const descriptions = {
    1: 'Unprocessed or minimally processed',
    2: 'Processed culinary ingredients',
    3: 'Processed foods',
    4: 'Ultra-processed foods',
  };

  const penalties = {
    1: 0,
    2: Math.round(weight * 0.3),
    3: Math.round(weight * 0.65),
    4: weight,
  };

  if (novaGroup && novaGroup >= 1 && novaGroup <= 4) {
    return {
      factor: 'processing',
      points: -penalties[novaGroup as keyof typeof penalties],
      description: `NOVA ${novaGroup}: ${descriptions[novaGroup as keyof typeof descriptions]}`,
      type: 'negative',
    };
  }

  const additiveLoad = calculateAdditiveLoad(additives);
  const fallbackRatioByLevel = {
    minimal: 0,
    low: 0.2,
    moderate: 0.5,
    high: 0.75,
    ultra: 1,
  };
  const fallbackRatio = fallbackRatioByLevel[additiveLoad.processingLevel];
  const fallbackPenalty = Math.round(weight * fallbackRatio);
  const fallbackLabel = additiveLoad.processingLevel.charAt(0).toUpperCase() + additiveLoad.processingLevel.slice(1);

  return {
    factor: 'processing',
    points: -fallbackPenalty,
    description: `Estimated processing (${fallbackLabel}) from additive profile`,
    type: 'negative',
  };
}

function getAdditivePenaltyCap(weight: number): number {
  return Math.round(weight * 1.5);
}

function getInteractionPenaltyCap(): number {
  return 12;
}

function calculateInteractionPenalty(additives: string[]): ScoreDetail | null {
  const interactions = detectInteractions(additives);
  if (interactions.length === 0) {
    return null;
  }

  const severityPenalty = {
    critical: 6,
    warning: 4,
    caution: 2,
    info: 1,
  };

  const totalPenalty = Math.min(
    getInteractionPenaltyCap(),
    interactions.reduce((sum, interaction) => sum + severityPenalty[interaction.severity], 0)
  );

  return {
    factor: 'additive interactions',
    points: -totalPenalty,
    description: `${interactions.length} concerning additive interaction(s) detected`,
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

// Score utility functions
export function getScoreColor(score: number): string {
  if (score >= 75) return '#22c55e'; // Green
  if (score >= 50) return '#eab308'; // Yellow
  if (score >= 25) return '#f97316'; // Orange
  return '#ef4444'; // Red
}

export function getScoreLabel(score: number): string {
  if (score >= 75) return 'Excellent';
  if (score >= 50) return 'Good';
  if (score >= 25) return 'Fair';
  return 'Poor';
}

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
