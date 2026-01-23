export type AdditiveRisk = 'safe' | 'moderate' | 'avoid';

export interface Additive {
  code: string;
  name: string;
  risk: AdditiveRisk;
  description?: string;
  concerns?: string[];
}

/**
 * Extended additive information with detailed explanations
 * Used for the "Why this rating?" feature
 */
export interface AdditiveExplanation {
  code: string;
  name: string;
  commonName?: string; // e.g., "MSG" for Monosodium Glutamate
  risk: AdditiveRisk;
  // What the additive does in food
  function: string;
  // Plain-language explanation of why it has this risk rating
  whyThisRating: string;
  // Common foods where this additive is found
  foundIn: string[];
  // Scientific sources and regulatory references
  sources: {
    name: string;
    url?: string;
  }[];
  // Additional notes or context
  notes?: string;
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
    omega3: number; // 0 for default, positive for personalized profiles (9p21 cardiovascular support)
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
    omega3: { low: number; medium: number; high: number }; // Used when omega3 weight > 0
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

// Personalized Analysis Types (based on genetic profile)

export type WarningSeverity = 'info' | 'caution' | 'warning' | 'critical';

export interface PersonalizedWarning {
  id: string;
  severity: WarningSeverity;
  title: string;
  message: string;
  geneticBasis: string;
  nutrientValue?: number;
  threshold?: number;
}

export interface PersonalizedBadge {
  id: string;
  type: 'positive' | 'neutral';
  title: string;
  description: string;
  geneticBasis: string;
}

export interface ContextualExplanation {
  nutrient: string;
  value: number;
  unit: string;
  standardThreshold: number;
  personalizedThreshold: number;
  isPersonalized: boolean;
  explanation: string;
  severity: 'good' | 'moderate' | 'high' | 'critical';
}

export interface AdditiveOverride {
  code: string;
  defaultRisk: AdditiveRisk;
  personalizedRisk: AdditiveRisk;
  reason: string;
}

export interface ProfileSummaryItem {
  status: 'good' | 'caution' | 'bad' | 'unknown';
  label: string;
  detail?: string;
}

export interface PersonalizedProfileSummary {
  items: ProfileSummaryItem[];
  overallFit: 'excellent' | 'good' | 'caution' | 'poor';
}

export interface PersonalizedAnalysis {
  warnings: PersonalizedWarning[];
  badges: PersonalizedBadge[];
  contextualExplanations: ContextualExplanation[];
  additiveOverrides: AdditiveOverride[];
  profileSummary: PersonalizedProfileSummary;
}

// ============================================
// ADDITIVE LOAD SCORE TYPES (Feature 5)
// ============================================

export type ProcessingLevel = 'minimal' | 'low' | 'moderate' | 'high' | 'ultra';

export interface AdditiveLoadBreakdown {
  safeCount: number;
  moderateCount: number;
  avoidCount: number;
  unknownCount: number;
}

export interface AdditiveLoadScore {
  totalCount: number;
  weightedScore: number; // 0-100
  processingLevel: ProcessingLevel;
  breakdown: AdditiveLoadBreakdown;
}

// ============================================
// ADDITIVE FUNCTION TYPES (Feature 7)
// ============================================

export type AdditiveFunction =
  | 'preservative'
  | 'coloring'
  | 'sweetener'
  | 'flavor_enhancer'
  | 'emulsifier'
  | 'thickener'
  | 'stabilizer'
  | 'antioxidant'
  | 'acidity_regulator'
  | 'raising_agent'
  | 'glazing_agent'
  | 'anti_caking'
  | 'humectant'
  | 'foaming_agent'
  | 'other';

export interface AdditiveFunctionInfo {
  function: AdditiveFunction;
  label: string;
  description: string;
  icon?: string;
}

// ============================================
// EXTERNAL API TYPES (Feature 6)
// ============================================

export interface ExternalAdditiveData {
  code: string;
  name: string;
  efsaRisk?: 'high' | 'moderate' | 'low' | 'none';
  additiveClasses?: string[];
  vegan?: boolean;
  vegetarian?: boolean;
  efsaEvaluationUrl?: string;
  description?: string;
}

export interface ResolvedAdditive {
  code: string;
  name: string;
  risk: AdditiveRisk;
  description?: string;
  concerns?: string[];
  functions?: AdditiveFunction[];
  vegan?: boolean;
  vegetarian?: boolean;
  efsaUrl?: string;
  source: 'local' | 'cached_api' | 'fresh_api' | 'fallback';
}

// ============================================
// REGULATORY STATUS TYPES (Feature 3)
// ============================================

export type RegulatoryJurisdiction = 'usa' | 'eu' | 'canada' | 'uk' | 'australia' | 'california';

export type RegulatoryStatus = 'approved' | 'restricted' | 'banned' | 'warning_required';

export interface RegulatoryInfo {
  jurisdiction: RegulatoryJurisdiction;
  status: RegulatoryStatus;
  notes?: string;
  maxLevel?: string;
  warningText?: string;
}

export interface AdditiveRegulatoryData {
  code: string;
  regulations: RegulatoryInfo[];
  bannedIn: RegulatoryJurisdiction[];
  restrictedIn: RegulatoryJurisdiction[];
}

// ============================================
// ADDITIVE INTERACTION TYPES (Feature 4)
// ============================================

export type InteractionType = 'formation' | 'amplification' | 'synergy';

export interface AdditiveInteraction {
  id: string;
  additives: string[];
  type: InteractionType;
  severity: WarningSeverity;
  title: string;
  description: string;
  resultingCompound?: string;
  scientificBasis?: string;
}

export interface InteractionWarning extends AdditiveInteraction {
  detectedAdditives: string[];
}

// ============================================
// PERSONALIZED ADDITIVE RULES TYPES (Feature 2)
// ============================================

export interface PersonalizedAdditiveRule {
  additives: string[];
  condition: string; // keyof GeneticProfile
  newRisk: AdditiveRisk;
  severity: WarningSeverity;
  warningTitle: string;
  warningMessage: string;
  geneticBasis: string;
}

export interface PersonalizedAdditiveWarning {
  additive: string;
  rule: PersonalizedAdditiveRule;
  originalRisk: AdditiveRisk;
}
