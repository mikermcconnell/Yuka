// Re-export scoring types for convenience
export type { ScoreBreakdown, ScoreDetail, PersonalizedAnalysis } from './scoring';
import type { ScoreBreakdown, PersonalizedAnalysis } from './scoring';

// Open Food Facts product types
export interface OpenFoodFactsProduct {
  code: string;
  product_name?: string;
  brands?: string;
  image_url?: string;
  image_front_url?: string;
  image_small_url?: string;
  ingredients_text?: string;
  nutriments?: Nutriments;
  nutrition_grades?: string; // A-E NutriScore
  nova_group?: number; // 1-4 processing level
  ecoscore_grade?: string;
  categories?: string;
  categories_tags?: string[];
  labels?: string;
  labels_tags?: string[];
  quantity?: string;
  serving_size?: string;
  additives_tags?: string[];
  allergens_tags?: string[];
  traces_tags?: string[];
  ingredients_analysis_tags?: string[];
  nutriscore_score?: number;
  nutriscore_grade?: string;
}

export interface Nutriments {
  energy_100g?: number;
  'energy-kcal_100g'?: number;
  fat_100g?: number;
  'saturated-fat_100g'?: number;
  carbohydrates_100g?: number;
  sugars_100g?: number;
  fiber_100g?: number;
  proteins_100g?: number;
  salt_100g?: number;
  sodium_100g?: number;
  'omega-3-fat_100g'?: number; // For personalized cardiovascular scoring
  // Per serving
  energy_serving?: number;
  'energy-kcal_serving'?: number;
  fat_serving?: number;
  'saturated-fat_serving'?: number;
  carbohydrates_serving?: number;
  sugars_serving?: number;
  fiber_serving?: number;
  proteins_serving?: number;
  salt_serving?: number;
  sodium_serving?: number;
}

export interface OpenFoodFactsResponse {
  code: string;
  product?: OpenFoodFactsProduct;
  status: number;
  status_verbose: string;
}

// App product types
export interface Product {
  barcode: string;
  name: string;
  brand?: string;
  imageUrl?: string;
  nutriments: Nutriments;
  nutritionGrade?: string;
  novaGroup?: number;
  ingredients?: string;
  additives: string[];
  allergens: string[];
  categories: string[];
  labels: string[];
  quantity?: string;
  servingSize?: string;
  healthScore: number;
  scoreBreakdown: ScoreBreakdown;
  isPersonalizedScore: boolean; // True if score uses user's genetic profile thresholds
  personalizedAnalysis?: PersonalizedAnalysis; // Detailed genetic profile analysis (warnings, badges, etc.)
  scannedAt?: Date;
}
