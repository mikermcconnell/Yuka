import type { Nutriments, ScoreBreakdown, ScoreDetail } from '@/types';
import { analyzeAdditives } from './additives';
import { getPersonalizedModifiers } from './personalizedConfigs';

// ============================================
// NutriScore 2023 Point Threshold Tables
// ============================================

// General Foods — Negative points (0-10 each, index = points)
// Value must be STRICTLY GREATER than threshold to earn that many points
const ENERGY_THRESHOLDS =    [335, 670, 1005, 1340, 1675, 2010, 2345, 2680, 3015, 3350]; // kJ
const SAT_FAT_THRESHOLDS =   [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // g
const SUGAR_THRESHOLDS =     [3.4, 6.8, 10, 14, 17, 20, 24, 27, 31, 34]; // g
const SALT_THRESHOLDS =      [0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2]; // g

// General Foods — Positive points (0-5 each)
const PROTEIN_THRESHOLDS =   [2.4, 4.8, 7.2, 9.6, 12]; // g
const FIBER_THRESHOLDS =     [3.0, 4.1, 5.2, 6.3, 7.4]; // g

// Beverage thresholds (different energy/sugar scales)
const BEV_ENERGY_THRESHOLDS = [30, 60, 90, 120, 150, 180, 210, 240, 270, 300]; // kJ per 100ml
const BEV_SUGAR_THRESHOLDS =  [0, 1.5, 3, 4.5, 6, 7.5, 9, 10.5, 12, 13.5]; // g per 100ml

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
  categories?: string[];
  userEmail?: string | null;
}

// ============================================
// NutriScore Calculation Helpers
// ============================================

/** Generic threshold lookup: returns how many thresholds the value exceeds */
function pointsFromThresholds(value: number, thresholds: number[]): number {
  let pts = 0;
  for (let i = 0; i < thresholds.length; i++) {
    if (value > thresholds[i]) {
      pts = i + 1;
    } else {
      break;
    }
  }
  return pts;
}

/** Calculate NutriScore negative points (N), range 0-40 */
function calculateNutriScoreN(nutriments: Nutriments, isBev: boolean): { N: number; details: ScoreDetail[] } {
  const details: ScoreDetail[] = [];

  // Energy in kJ (OFF provides energy_100g in kJ)
  const energyKj = nutriments.energy_100g || 0;
  const energyThresholds = isBev ? BEV_ENERGY_THRESHOLDS : ENERGY_THRESHOLDS;
  const energyPts = pointsFromThresholds(energyKj, energyThresholds);
  details.push({
    factor: 'energy',
    points: -energyPts,
    description: `Energy: ${Math.round(energyKj)} kJ/100g (${energyPts} pts)`,
    type: 'negative',
  });

  // Saturated fat
  const satFat = nutriments['saturated-fat_100g'] || 0;
  const satFatPts = pointsFromThresholds(satFat, SAT_FAT_THRESHOLDS);
  details.push({
    factor: 'saturated fat',
    points: -satFatPts,
    description: `Saturated fat: ${satFat.toFixed(1)}g/100g (${satFatPts} pts)`,
    type: 'negative',
  });

  // Sugar
  const sugar = nutriments.sugars_100g || 0;
  const sugarThresholds = isBev ? BEV_SUGAR_THRESHOLDS : SUGAR_THRESHOLDS;
  const sugarPts = pointsFromThresholds(sugar, sugarThresholds);
  details.push({
    factor: 'sugar',
    points: -sugarPts,
    description: `Sugar: ${sugar.toFixed(1)}g/100g (${sugarPts} pts)`,
    type: 'negative',
  });

  // Salt
  const salt = nutriments.salt_100g || (nutriments.sodium_100g ? nutriments.sodium_100g * 2.5 : 0);
  const saltPts = pointsFromThresholds(salt, SALT_THRESHOLDS);
  details.push({
    factor: 'salt',
    points: -saltPts,
    description: `Salt: ${salt.toFixed(1)}g/100g (${saltPts} pts)`,
    type: 'negative',
  });

  return { N: energyPts + satFatPts + sugarPts + saltPts, details };
}

/** Calculate NutriScore positive points (P), range 0-15. Protein excluded when N > 11. */
function calculateNutriScoreP(nutriments: Nutriments, N: number, isBev: boolean): { P: number; details: ScoreDetail[] } {
  const details: ScoreDetail[] = [];

  // Fiber
  const fiber = nutriments.fiber_100g || 0;
  const fiberPts = pointsFromThresholds(fiber, FIBER_THRESHOLDS);
  details.push({
    factor: 'fiber',
    points: fiberPts,
    description: `Fiber: ${fiber.toFixed(1)}g/100g (${fiberPts} pts)`,
    type: 'positive',
  });

  // Fruits/veg % — not reliably available from OFF, default to 0
  const fruitsVegPts = 0;

  // Protein — excluded when N > 11 (unless beverage)
  const protein = nutriments.proteins_100g || 0;
  const rawProteinPts = pointsFromThresholds(protein, PROTEIN_THRESHOLDS);
  const proteinIncluded = N <= 11 || isBev;
  const proteinPts = proteinIncluded ? rawProteinPts : 0;
  details.push({
    factor: 'protein',
    points: proteinPts,
    description: proteinIncluded
      ? `Protein: ${protein.toFixed(1)}g/100g (${proteinPts} pts)`
      : `Protein: ${protein.toFixed(1)}g/100g (excluded, N>${11})`,
    type: 'positive',
  });

  return { P: fiberPts + fruitsVegPts + proteinPts, details };
}

/** Map NutriScore net points to a quality score 0-100 */
function nutriScoreToQuality(netPoints: number): number {
  // netPoints range: -15 (best) to +40 (worst)
  // Map linearly: -15 → 100, +40 → 0
  const quality = ((40 - netPoints) / 55) * 100;
  return Math.max(0, Math.min(100, quality));
}

/** Map NutriScore net points to a grade A-E */
function nutriScoreGrade(netPoints: number, isBev: boolean): string {
  if (isBev) {
    // Beverage grade mapping (water = A, handled separately)
    if (netPoints <= 2) return 'B';
    if (netPoints <= 6) return 'C';
    if (netPoints <= 9) return 'D';
    return 'E';
  }
  // General foods
  if (netPoints <= 0) return 'A';
  if (netPoints <= 2) return 'B';
  if (netPoints <= 10) return 'C';
  if (netPoints <= 18) return 'D';
  return 'E';
}

/** Calculate additive quality (0-100) from additive analysis */
function calculateAdditiveQuality(analysis: {
  safe: unknown[];
  moderate: unknown[];
  avoid: unknown[];
  unknown: string[];
}): { quality: number; hasAvoid: boolean; detail: ScoreDetail } {
  const avoidPenalty = analysis.avoid.length * 30;
  const moderatePenalty = analysis.moderate.length * 15;
  const unknownPenalty = analysis.unknown.length * 8;
  const totalPenalty = avoidPenalty + moderatePenalty + unknownPenalty;
  const quality = Math.max(0, 100 - totalPenalty);

  let description: string;
  if (analysis.avoid.length > 0) {
    description = `${analysis.avoid.length} additive(s) to avoid, ${analysis.moderate.length} moderate`;
  } else if (analysis.moderate.length > 0) {
    description = `${analysis.moderate.length} additive(s) with moderate risk`;
  } else if (analysis.unknown.length > 0) {
    description = `${analysis.unknown.length} unknown additive(s)`;
  } else {
    description = 'No concerning additives';
  }

  return {
    quality,
    hasAvoid: analysis.avoid.length > 0,
    detail: {
      factor: 'additives',
      points: -totalPenalty,
      description,
      type: 'negative',
    },
  };
}

// ============================================
// Beverage Detection
// ============================================

export function isBeverage(categories: string[]): boolean {
  const lowerCategories = categories.map(c => c.toLowerCase());
  return lowerCategories.some(cat =>
    BEVERAGE_CATEGORIES.some(bev => cat.includes(bev))
  );
}

// ============================================
// Main Scoring Function (60/30/10 + Hard Cap)
// ============================================

export function calculateHealthScore(input: ScoreInput): {
  score: number;
  breakdown: ScoreBreakdown;
  isPersonalized: boolean;
} {
  const { nutriments, additives, labels, categories = [], userEmail } = input;

  const isBev = isBeverage(categories);

  // --- NutriScore calculation ---
  const { N: rawN, details: nDetails } = calculateNutriScoreN(nutriments, isBev);
  const { P: rawP, details: pDetails } = calculateNutriScoreP(nutriments, rawN, isBev);

  // Apply personalized modifiers
  const modifiers = getPersonalizedModifiers(userEmail);
  const isPersonalized = modifiers !== null;
  const N = modifiers ? modifiers.adjustN(rawN, nutriments as Record<string, number | undefined>) : rawN;
  const P = modifiers ? modifiers.adjustP(rawP, nutriments as Record<string, number | undefined>) : rawP;

  const netPoints = N - P;
  const nutritionalQuality = Math.round(nutriScoreToQuality(netPoints));
  const grade = nutriScoreGrade(netPoints, isBev);

  // --- Additive quality ---
  const additiveAnalysis = analyzeAdditives(additives);
  const { quality: additiveQuality, hasAvoid, detail: additiveDetail } = calculateAdditiveQuality(additiveAnalysis);

  // --- Organic bonus ---
  const organicLabels = ['organic', 'bio', 'usda organic', 'eu organic', 'ab agriculture biologique'];
  const hasOrganic = labels.some(label =>
    organicLabels.some(org => label.toLowerCase().includes(org))
  );
  const organicBonus = hasOrganic ? 100 : 0;

  // --- 60/30/10 formula ---
  let finalScore = Math.round(
    nutritionalQuality * 0.6 + additiveQuality * 0.3 + organicBonus * 0.1
  );

  // Hard cap: if any "avoid" additive, score cannot exceed 49
  if (hasAvoid && finalScore > 49) {
    finalScore = 49;
  }

  finalScore = Math.max(0, Math.min(100, finalScore));

  // Build details list (backward-compatible)
  const details: ScoreDetail[] = [
    ...nDetails,
    ...pDetails,
    additiveDetail,
  ];

  if (hasOrganic) {
    details.push({
      factor: 'organic',
      points: 10, // Represents the 10% weight
      description: 'Organic certification bonus',
      type: 'positive',
    });
  }

  // Calculate legacy positive/negative points for backward compat
  const positivePoints = details.filter(d => d.type === 'positive').reduce((s, d) => s + d.points, 0);
  const negativePoints = details.filter(d => d.type === 'negative').reduce((s, d) => s + Math.abs(d.points), 0);

  return {
    score: finalScore,
    breakdown: {
      positivePoints,
      negativePoints,
      details,
      nutritionalQuality,
      additiveQuality,
      organicBonus,
      nutriScorePoints: netPoints,
      nutriScoreGrade: grade,
      hasAvoidAdditive: hasAvoid,
    },
    isPersonalized,
  };
}

// ============================================
// Score Utility Functions
// ============================================

export function getScoreColor(score: number): string {
  if (score >= 75) return '#22c55e'; // Green
  if (score >= 50) return '#eab308'; // Yellow
  if (score >= 25) return '#f97316'; // Orange
  return '#ef4444'; // Red
}

export function getScoreLabel(score: number): string {
  if (score >= 75) return 'Excellent';
  if (score >= 50) return 'Good';
  if (score >= 25) return 'Mediocre';
  return 'Bad';
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
