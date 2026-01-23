export type AdditiveRisk = 'safe' | 'moderate' | 'avoid';

export interface Additive {
  code: string;
  name: string;
  risk: AdditiveRisk;
  description?: string;
  concerns?: string[];
}

export interface ScoreBreakdown {
  positivePoints: number;
  negativePoints: number;
  details: ScoreDetail[];
}

export interface ScoreDetail {
  factor: string;
  points: number;
  description: string;
  type: 'positive' | 'negative';
}

export interface ScoringConfig {
  // Weight multipliers
  weights: {
    sugar: number;
    saturatedFat: number;
    sodium: number;
    calories: number;
    fiber: number;
    protein: number;
    additives: number;
    organic: number;
    processing: number;
  };
  // Thresholds per 100g
  thresholds: {
    sugar: { low: number; medium: number; high: number };
    saturatedFat: { low: number; medium: number; high: number };
    sodium: { low: number; medium: number; high: number };
    calories: { low: number; medium: number; high: number };
    fiber: { low: number; medium: number; high: number };
    protein: { low: number; medium: number; high: number };
  };
}

export interface NutrientAnalysis {
  nutrient: string;
  value: number;
  unit: string;
  rating: 'good' | 'moderate' | 'poor';
  percentDV?: number;
  message: string;
}
