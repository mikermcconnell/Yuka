import { Nutriments, AdditiveRisk } from '@/types';
import { getAdditive } from './additives';

/**
 * Personalized health analysis based on genetic profile.
 * Provides warnings, badges, and contextual explanations.
 */

// Warning severity levels
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

// Genetic profile configuration for personalized analysis
interface GeneticProfile {
  // Nutrient sensitivities
  saturatedFatSensitive: boolean;
  saturatedFatThreshold: number; // g per serving
  saltSensitive: boolean;

  // Carrier status
  ironOverloadCarrier: boolean;
  lactoseIntolerant: boolean;

  // Cardiovascular
  cardiovascularRisk: boolean;

  // Metabolism
  fastCaffeineMetabolizer: boolean;
  favorableCarbs: boolean;

  // Needs
  needsOmega3: boolean;
  needsFolate: boolean;

  // Athletic
  enduranceType: boolean;
}

// User-specific genetic profiles
// Email addresses are loaded from environment variable for privacy
const GENETIC_PROFILE_EMAIL = process.env.NEXT_PUBLIC_GENETIC_PROFILE_EMAIL?.toLowerCase().trim();

const GENETIC_PROFILES: Record<string, GeneticProfile> = GENETIC_PROFILE_EMAIL ? {
  [GENETIC_PROFILE_EMAIL]: {
    saturatedFatSensitive: true,
    saturatedFatThreshold: 3.5, // g per 100g - stricter than default 5g
    saltSensitive: false, // CYP11B2 GG
    ironOverloadCarrier: true, // H63D carrier
    lactoseIntolerant: true, // MCM6 AA
    cardiovascularRisk: true, // 9p21 variants
    fastCaffeineMetabolizer: true, // CYP1A2 AA
    favorableCarbs: true, // TCF7L2 CC
    needsOmega3: true, // 9p21, CETP AA
    needsFolate: true, // MTHFR A1298C
    enduranceType: true, // ACTN3 XX
  },
} : {};

// Additives that should be overridden for specific genetic profiles
const ADDITIVE_OVERRIDES: Record<string, Record<string, { risk: AdditiveRisk; reason: string }>> = GENETIC_PROFILE_EMAIL ? {
  [GENETIC_PROFILE_EMAIL]: {
    // Nitrites/Nitrates - elevated to avoid due to cardiovascular risk
    'E249': { risk: 'avoid', reason: '9p21 cardiovascular variants - nitrites form harmful compounds' },
    'E250': { risk: 'avoid', reason: '9p21 cardiovascular variants - nitrites form harmful compounds' },
    'E251': { risk: 'avoid', reason: '9p21 cardiovascular variants - nitrates convert to nitrites' },
    'E252': { risk: 'avoid', reason: '9p21 cardiovascular variants - nitrates convert to nitrites' },
    // Artificial sweeteners - can be more lenient due to favorable metabolic genetics
    'E950': { risk: 'moderate', reason: 'Favorable metabolic genetics (TCF7L2 CC) - lower concern' },
    'E951': { risk: 'moderate', reason: 'Favorable metabolic genetics - lower concern than default' },
    'E955': { risk: 'moderate', reason: 'Favorable metabolic genetics - lower concern than default' },
  },
} : {};

/**
 * Get genetic profile for a user, or null if none exists.
 */
function getGeneticProfile(userEmail: string | null | undefined): GeneticProfile | null {
  if (!userEmail) return null;
  const normalizedEmail = userEmail.toLowerCase().trim();
  return GENETIC_PROFILES[normalizedEmail] || null;
}

/**
 * Analyze product for personalized warnings based on genetic profile.
 */
function analyzeWarnings(
  nutriments: Nutriments,
  additives: string[],
  labels: string[],
  ingredients: string | undefined,
  profile: GeneticProfile
): PersonalizedWarning[] {
  const warnings: PersonalizedWarning[] = [];

  // Saturated fat warning
  const satFat = nutriments['saturated-fat_100g'];
  if (profile.saturatedFatSensitive && satFat !== undefined) {
    if (satFat > profile.saturatedFatThreshold) {
      warnings.push({
        id: 'high-sat-fat',
        severity: satFat > 5 ? 'critical' : 'warning',
        title: 'High Saturated Fat for You',
        message: `${satFat.toFixed(1)}g per 100g exceeds your ${profile.saturatedFatThreshold}g threshold`,
        geneticBasis: 'APOA2 AA - saturated fat sensitivity',
        nutrientValue: satFat,
        threshold: profile.saturatedFatThreshold,
      });
    }
  }

  // Nitrite/Nitrate warning
  if (profile.cardiovascularRisk) {
    const nitriteAdditives = additives.filter(a =>
      ['E249', 'E250', 'E251', 'E252'].includes(a.toUpperCase())
    );
    if (nitriteAdditives.length > 0) {
      warnings.push({
        id: 'contains-nitrites',
        severity: 'warning',
        title: 'Contains Nitrites/Nitrates',
        message: `Contains ${nitriteAdditives.join(', ')} - avoid for cardiovascular health`,
        geneticBasis: '9p21 cardiovascular variants',
      });
    }
  }

  // Iron fortified warning
  if (profile.ironOverloadCarrier && ingredients) {
    const lowerIngredients = ingredients.toLowerCase();
    if (
      lowerIngredients.includes('iron') ||
      lowerIngredients.includes('ferrous') ||
      lowerIngredients.includes('ferric') ||
      lowerIngredients.includes('fortified with')
    ) {
      warnings.push({
        id: 'iron-fortified',
        severity: 'caution',
        title: 'May Contain Added Iron',
        message: 'Check if iron-fortified - avoid supplemental iron',
        geneticBasis: 'H63D carrier - iron overload risk',
      });
    }
  }

  // Lactose warning
  if (profile.lactoseIntolerant) {
    const hasLactose = checkForLactose(labels, ingredients);
    if (hasLactose === 'likely') {
      warnings.push({
        id: 'contains-lactose',
        severity: 'caution',
        title: 'Likely Contains Lactose',
        message: 'Dairy product without lactose-free indication',
        geneticBasis: 'MCM6 AA - lactose intolerance',
      });
    }
  }

  // Caffeine info (informational, not a warning)
  if (profile.fastCaffeineMetabolizer && ingredients) {
    const lowerIngredients = ingredients.toLowerCase();
    if (
      lowerIngredients.includes('caffeine') ||
      lowerIngredients.includes('coffee') ||
      lowerIngredients.includes('guarana') ||
      lowerIngredients.includes('green tea extract')
    ) {
      warnings.push({
        id: 'caffeine-note',
        severity: 'info',
        title: 'Contains Caffeine',
        message: 'You metabolize caffeine quickly (clears in 3-4 hrs)',
        geneticBasis: 'CYP1A2 AA - fast caffeine metabolizer',
      });
    }
  }

  return warnings;
}

/**
 * Check if product likely contains lactose.
 */
function checkForLactose(labels: string[], ingredients: string | undefined): 'likely' | 'unlikely' | 'unknown' {
  const lowerLabels = labels.map(l => l.toLowerCase());

  // Check for lactose-free labels
  if (lowerLabels.some(l =>
    l.includes('lactose-free') ||
    l.includes('lactose free') ||
    l.includes('dairy-free') ||
    l.includes('dairy free') ||
    l.includes('vegan')
  )) {
    return 'unlikely';
  }

  // Check for dairy indicators
  if (ingredients) {
    const lowerIngredients = ingredients.toLowerCase();
    const dairyIndicators = ['milk', 'cream', 'butter', 'cheese', 'whey', 'casein', 'lactose'];
    if (dairyIndicators.some(d => lowerIngredients.includes(d))) {
      return 'likely';
    }
  }

  // Check labels for dairy category
  if (lowerLabels.some(l =>
    l.includes('dairy') ||
    l.includes('milk') ||
    l.includes('cheese') ||
    l.includes('yogurt')
  )) {
    return 'likely';
  }

  return 'unknown';
}

/**
 * Analyze product for positive badges based on genetic profile.
 */
function analyzeBadges(
  nutriments: Nutriments,
  additives: string[],
  labels: string[],
  profile: GeneticProfile
): PersonalizedBadge[] {
  const badges: PersonalizedBadge[] = [];

  const satFat = nutriments['saturated-fat_100g'] || 0;
  const omega3 = nutriments['omega-3-fat_100g'];
  const fiber = nutriments.fiber_100g || 0;
  const protein = nutriments.proteins_100g || 0;
  const carbs = nutriments.carbohydrates_100g || 0;

  // Check for nitrites
  const hasNitrites = additives.some(a =>
    ['E249', 'E250', 'E251', 'E252'].includes(a.toUpperCase())
  );

  // Heart Healthy badge
  if (
    profile.cardiovascularRisk &&
    satFat < 2 &&
    !hasNitrites &&
    (omega3 === undefined || omega3 > 0.3)
  ) {
    badges.push({
      id: 'heart-healthy',
      type: 'positive',
      title: 'Heart Healthy for You',
      description: 'Low saturated fat, no nitrites' + (omega3 ? ', contains omega-3s' : ''),
      geneticBasis: '9p21 cardiovascular, APOA2 AA',
    });
  }

  // Omega-3 Rich badge
  if (profile.needsOmega3 && omega3 !== undefined && omega3 >= 0.5) {
    badges.push({
      id: 'omega3-rich',
      type: 'positive',
      title: 'Omega-3 Rich',
      description: `Contains ${omega3.toFixed(1)}g omega-3 per 100g`,
      geneticBasis: '9p21 cardiovascular, CETP AA HDL support',
    });
  }

  // Folate Rich badge - check labels for folate-rich categories
  const folateRichCategories = ['legumes', 'lentils', 'spinach', 'asparagus', 'broccoli', 'beans'];
  const isFolateRich = labels.some(l =>
    folateRichCategories.some(cat => l.toLowerCase().includes(cat))
  );
  if (profile.needsFolate && (isFolateRich || fiber > 5)) {
    badges.push({
      id: 'folate-fiber',
      type: 'positive',
      title: 'Folate/Fiber Rich',
      description: 'Good source of fiber and likely folate',
      geneticBasis: 'MTHFR A1298C - benefits from dietary folate',
    });
  }

  // Endurance Fuel badge
  if (
    profile.enduranceType &&
    profile.favorableCarbs &&
    carbs > 40 &&
    protein > 5 &&
    satFat < 3
  ) {
    badges.push({
      id: 'endurance-fuel',
      type: 'positive',
      title: 'Endurance Fuel',
      description: 'Good carb/protein ratio with low saturated fat',
      geneticBasis: 'ACTN3 XX endurance type, TCF7L2 favorable carbs',
    });
  }

  // Low Sat Fat badge (specifically for APOA2)
  if (profile.saturatedFatSensitive && satFat < 1) {
    badges.push({
      id: 'low-sat-fat',
      type: 'positive',
      title: 'Low Saturated Fat',
      description: `Only ${satFat.toFixed(1)}g - excellent for your genetics`,
      geneticBasis: 'APOA2 AA sensitivity',
    });
  }

  return badges;
}

/**
 * Generate contextual explanations for nutrient scores.
 */
function generateContextualExplanations(
  nutriments: Nutriments,
  profile: GeneticProfile
): ContextualExplanation[] {
  const explanations: ContextualExplanation[] = [];

  // Saturated fat
  const satFat = nutriments['saturated-fat_100g'];
  if (satFat !== undefined && profile.saturatedFatSensitive) {
    const standardThreshold = 5;
    const personalizedThreshold = profile.saturatedFatThreshold;
    let severity: ContextualExplanation['severity'];

    if (satFat <= 1) severity = 'good';
    else if (satFat <= personalizedThreshold) severity = 'moderate';
    else if (satFat <= 5) severity = 'high';
    else severity = 'critical';

    explanations.push({
      nutrient: 'Saturated Fat',
      value: satFat,
      unit: 'g/100g',
      standardThreshold,
      personalizedThreshold,
      isPersonalized: true,
      explanation: satFat > personalizedThreshold
        ? `Exceeds your genetic threshold. Your APOA2 AA genotype means saturated fat has a larger effect on your LDL cholesterol and weight.`
        : `Within your personalized limit. Your stricter threshold accounts for APOA2 AA sensitivity.`,
      severity,
    });
  }

  // Sugar (more lenient for favorable carb genetics)
  const sugar = nutriments.sugars_100g;
  if (sugar !== undefined && profile.favorableCarbs) {
    const standardThreshold = 22.5;
    const personalizedThreshold = 25; // More lenient
    let severity: ContextualExplanation['severity'];

    if (sugar <= 6) severity = 'good';
    else if (sugar <= 15) severity = 'moderate';
    else if (sugar <= personalizedThreshold) severity = 'high';
    else severity = 'critical';

    explanations.push({
      nutrient: 'Sugar',
      value: sugar,
      unit: 'g/100g',
      standardThreshold,
      personalizedThreshold,
      isPersonalized: true,
      explanation: `Your TCF7L2 CC genotype means you handle carbohydrates well. Slightly more permissive threshold.`,
      severity,
    });
  }

  // Sodium (not sensitive)
  const sodium = nutriments.sodium_100g || (nutriments.salt_100g ? nutriments.salt_100g / 2.5 : undefined);
  if (sodium !== undefined && !profile.saltSensitive) {
    const standardThreshold = 1.2;
    const personalizedThreshold = 1.5; // More lenient
    let severity: ContextualExplanation['severity'];

    if (sodium <= 0.4) severity = 'good';
    else if (sodium <= 0.8) severity = 'moderate';
    else if (sodium <= personalizedThreshold) severity = 'high';
    else severity = 'critical';

    explanations.push({
      nutrient: 'Sodium',
      value: sodium,
      unit: 'g/100g',
      standardThreshold,
      personalizedThreshold,
      isPersonalized: true,
      explanation: `Your CYP11B2 GG genotype means you're not salt-sensitive. Standard sodium guidelines apply.`,
      severity,
    });
  }

  // Omega-3
  const omega3 = nutriments['omega-3-fat_100g'];
  if (omega3 !== undefined && profile.needsOmega3) {
    let severity: ContextualExplanation['severity'];

    if (omega3 >= 1.5) severity = 'good';
    else if (omega3 >= 0.5) severity = 'moderate';
    else if (omega3 >= 0.1) severity = 'high';
    else severity = 'critical';

    explanations.push({
      nutrient: 'Omega-3',
      value: omega3,
      unit: 'g/100g',
      standardThreshold: 0, // Not typically tracked
      personalizedThreshold: 0.5, // Your target
      isPersonalized: true,
      explanation: `Omega-3s support your cardiovascular health (9p21 variants) and HDL levels (CETP AA).`,
      severity,
    });
  }

  return explanations;
}

/**
 * Get personalized additive risk overrides.
 */
function getAdditiveOverrides(
  additives: string[],
  userEmail: string
): AdditiveOverride[] {
  const normalizedEmail = userEmail.toLowerCase().trim();
  const userOverrides = ADDITIVE_OVERRIDES[normalizedEmail];

  if (!userOverrides) return [];

  const overrides: AdditiveOverride[] = [];

  for (const code of additives) {
    const normalizedCode = code.toUpperCase();
    const override = userOverrides[normalizedCode];

    if (override) {
      const defaultAdditive = getAdditive(code);
      overrides.push({
        code: normalizedCode,
        defaultRisk: defaultAdditive?.risk || 'moderate',
        personalizedRisk: override.risk,
        reason: override.reason,
      });
    }
  }

  return overrides;
}

/**
 * Generate profile summary card data.
 */
function generateProfileSummary(
  nutriments: Nutriments,
  additives: string[],
  labels: string[],
  ingredients: string | undefined,
  profile: GeneticProfile
): PersonalizedProfileSummary {
  const items: ProfileSummaryItem[] = [];

  // Saturated fat check
  const satFat = nutriments['saturated-fat_100g'];
  if (satFat !== undefined) {
    if (satFat <= 1) {
      items.push({ status: 'good', label: 'Low saturated fat', detail: `${satFat.toFixed(1)}g` });
    } else if (satFat <= profile.saturatedFatThreshold) {
      items.push({ status: 'caution', label: 'Moderate saturated fat', detail: `${satFat.toFixed(1)}g` });
    } else {
      items.push({ status: 'bad', label: 'High saturated fat for you', detail: `${satFat.toFixed(1)}g > ${profile.saturatedFatThreshold}g limit` });
    }
  } else {
    items.push({ status: 'unknown', label: 'Saturated fat data unavailable' });
  }

  // Omega-3 check
  const omega3 = nutriments['omega-3-fat_100g'];
  if (profile.needsOmega3) {
    if (omega3 !== undefined && omega3 >= 0.3) {
      items.push({ status: 'good', label: 'Contains omega-3s', detail: `${omega3.toFixed(1)}g` });
    } else if (omega3 !== undefined) {
      items.push({ status: 'caution', label: 'Low omega-3 content', detail: `${omega3.toFixed(1)}g` });
    } else {
      items.push({ status: 'unknown', label: 'No omega-3 data available' });
    }
  }

  // Nitrite check
  const hasNitrites = additives.some(a =>
    ['E249', 'E250', 'E251', 'E252'].includes(a.toUpperCase())
  );
  if (profile.cardiovascularRisk) {
    if (hasNitrites) {
      items.push({ status: 'bad', label: 'Contains nitrites', detail: 'Avoid for cardiovascular health' });
    } else if (additives.length > 0) {
      items.push({ status: 'good', label: 'No nitrites detected' });
    }
  }

  // Iron check
  if (profile.ironOverloadCarrier && ingredients) {
    const lowerIngredients = ingredients.toLowerCase();
    const hasAddedIron = lowerIngredients.includes('iron') ||
                         lowerIngredients.includes('ferrous') ||
                         lowerIngredients.includes('ferric');
    if (hasAddedIron) {
      items.push({ status: 'caution', label: 'May contain added iron', detail: 'H63D carrier' });
    }
  }

  // Lactose check
  if (profile.lactoseIntolerant) {
    const lactoseStatus = checkForLactose(labels, ingredients);
    if (lactoseStatus === 'likely') {
      items.push({ status: 'caution', label: 'Likely contains lactose' });
    } else if (lactoseStatus === 'unlikely') {
      items.push({ status: 'good', label: 'Lactose-free or dairy-free' });
    }
  }

  // Fiber check (for MTHFR/folate)
  const fiber = nutriments.fiber_100g;
  if (profile.needsFolate && fiber !== undefined) {
    if (fiber >= 5) {
      items.push({ status: 'good', label: 'High fiber (folate source)', detail: `${fiber.toFixed(1)}g` });
    }
  }

  // Calculate overall fit
  const goodCount = items.filter(i => i.status === 'good').length;
  const badCount = items.filter(i => i.status === 'bad').length;
  const cautionCount = items.filter(i => i.status === 'caution').length;

  let overallFit: PersonalizedProfileSummary['overallFit'];
  if (badCount >= 2) {
    overallFit = 'poor';
  } else if (badCount === 1 || cautionCount >= 2) {
    overallFit = 'caution';
  } else if (goodCount >= 3) {
    overallFit = 'excellent';
  } else {
    overallFit = 'good';
  }

  return { items, overallFit };
}

/**
 * Main function to generate complete personalized analysis for a product.
 */
export function analyzeForProfile(
  nutriments: Nutriments,
  additives: string[],
  labels: string[],
  ingredients: string | undefined,
  userEmail: string | null | undefined
): PersonalizedAnalysis | null {
  const profile = getGeneticProfile(userEmail);

  if (!profile || !userEmail) {
    return null;
  }

  return {
    warnings: analyzeWarnings(nutriments, additives, labels, ingredients, profile),
    badges: analyzeBadges(nutriments, additives, labels, profile),
    contextualExplanations: generateContextualExplanations(nutriments, profile),
    additiveOverrides: getAdditiveOverrides(additives, userEmail),
    profileSummary: generateProfileSummary(nutriments, additives, labels, ingredients, profile),
  };
}

/**
 * Check if a user has a genetic profile configured.
 */
export function hasGeneticProfile(userEmail: string | null | undefined): boolean {
  return getGeneticProfile(userEmail) !== null;
}
