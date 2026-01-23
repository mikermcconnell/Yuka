import {
  PersonalizedAdditiveRule,
  PersonalizedAdditiveWarning,
  AdditiveRisk,
  WarningSeverity,
} from '@/types';
import { getAdditive } from './additives';

/**
 * Personalized Additive Rules (Feature 2)
 *
 * Defines rules for adjusting additive risk ratings based on genetic profiles
 * and health conditions. Generates personalized warnings when relevant.
 */

/**
 * Extended genetic profile conditions for additive personalization.
 * These extend the base GeneticProfile in personalizedAnalysis.ts.
 */
export interface AdditiveGeneticConditions {
  // From original GeneticProfile
  cardiovascularRisk: boolean;
  lactoseIntolerant: boolean;
  ironOverloadCarrier: boolean;
  fastCaffeineMetabolizer: boolean;
  favorableCarbs: boolean;

  // Extended conditions for additive rules
  sulfiteSensitive: boolean;       // Asthma/sulfite reactions
  pkuCarrier: boolean;             // Phenylketonuria - must avoid phenylalanine
  boneHealthConcern: boolean;      // Osteoporosis risk
  ibsSufferer: boolean;            // Irritable Bowel Syndrome
  migraineProne: boolean;          // Prone to migraines
  goutRisk: boolean;               // High uric acid/gout
  aspirinSensitive: boolean;       // Aspirin/salicylate sensitivity
  histamineIntolerant: boolean;    // Histamine intolerance
  glutamateSensitive: boolean;     // MSG sensitivity
  childWithADHD: boolean;          // Relevant for Southampton Six
}

/**
 * Personalized rules for adjusting additive risk based on conditions.
 */
export const PERSONALIZED_ADDITIVE_RULES: PersonalizedAdditiveRule[] = [
  // ============================================
  // SULFITE SENSITIVITY (Asthma)
  // ============================================
  {
    additives: ['E220', 'E221', 'E222', 'E223', 'E224', 'E225', 'E226', 'E227', 'E228'],
    condition: 'sulfiteSensitive',
    newRisk: 'avoid',
    severity: 'critical',
    warningTitle: 'Contains Sulfites',
    warningMessage:
      'Sulfites may trigger severe asthma symptoms including breathing difficulties. Consider alternatives.',
    geneticBasis: 'Sulfite sensitivity / Asthma',
  },

  // ============================================
  // PKU - PHENYLALANINE
  // ============================================
  {
    additives: ['E951'], // Aspartame
    condition: 'pkuCarrier',
    newRisk: 'avoid',
    severity: 'critical',
    warningTitle: 'Contains Phenylalanine',
    warningMessage:
      'Aspartame contains phenylalanine which must be strictly avoided with PKU. This is medically critical.',
    geneticBasis: 'PKU (Phenylketonuria)',
  },
  {
    additives: ['E962'], // Aspartame-Acesulfame Salt
    condition: 'pkuCarrier',
    newRisk: 'avoid',
    severity: 'critical',
    warningTitle: 'Contains Phenylalanine',
    warningMessage:
      'This sweetener contains aspartame which has phenylalanine. Must avoid with PKU.',
    geneticBasis: 'PKU (Phenylketonuria)',
  },

  // ============================================
  // BONE HEALTH
  // ============================================
  {
    additives: ['E338'], // Phosphoric acid
    condition: 'boneHealthConcern',
    newRisk: 'avoid',
    severity: 'warning',
    warningTitle: 'Phosphoric Acid',
    warningMessage:
      'Regular consumption may affect calcium absorption and bone mineral density. Limit intake for bone health.',
    geneticBasis: 'Bone health concern / Osteoporosis risk',
  },
  {
    additives: ['E450', 'E451', 'E452'], // Phosphates
    condition: 'boneHealthConcern',
    newRisk: 'moderate',
    severity: 'caution',
    warningTitle: 'Contains Phosphates',
    warningMessage:
      'High phosphate intake may affect bone health. Monitor overall phosphate consumption.',
    geneticBasis: 'Bone health concern',
  },

  // ============================================
  // IBS / DIGESTIVE ISSUES
  // ============================================
  {
    additives: ['E407'], // Carrageenan
    condition: 'ibsSufferer',
    newRisk: 'avoid',
    severity: 'warning',
    warningTitle: 'Carrageenan - Gut Irritant',
    warningMessage:
      'Carrageenan may worsen IBS symptoms and gut inflammation. Consider carrageenan-free alternatives.',
    geneticBasis: 'IBS (Irritable Bowel Syndrome)',
  },
  {
    additives: ['E412', 'E415', 'E466'], // Gums
    condition: 'ibsSufferer',
    newRisk: 'moderate',
    severity: 'caution',
    warningTitle: 'Contains Thickening Gums',
    warningMessage:
      'These gums may cause bloating, gas, or discomfort in people with IBS.',
    geneticBasis: 'IBS (Irritable Bowel Syndrome)',
  },
  {
    additives: ['E433'], // Polysorbate 80
    condition: 'ibsSufferer',
    newRisk: 'avoid',
    severity: 'warning',
    warningTitle: 'Emulsifier - Gut Concern',
    warningMessage:
      'Polysorbate 80 may affect gut bacteria and worsen inflammatory conditions.',
    geneticBasis: 'IBS / Inflammatory bowel issues',
  },

  // ============================================
  // MIGRAINES
  // ============================================
  {
    additives: ['E621', 'E620', 'E622', 'E623', 'E624', 'E625'], // MSG family
    condition: 'migraineProne',
    newRisk: 'avoid',
    severity: 'warning',
    warningTitle: 'Contains Glutamates (MSG)',
    warningMessage:
      'MSG and related glutamates are known migraine triggers. Avoid if prone to headaches.',
    geneticBasis: 'Migraine susceptibility',
  },
  {
    additives: ['E280', 'E281', 'E282'], // Propionates
    condition: 'migraineProne',
    newRisk: 'moderate',
    severity: 'caution',
    warningTitle: 'Propionate Preservatives',
    warningMessage:
      'Propionates may trigger migraines in some individuals.',
    geneticBasis: 'Migraine susceptibility',
  },
  {
    additives: ['E951'], // Aspartame
    condition: 'migraineProne',
    newRisk: 'avoid',
    severity: 'warning',
    warningTitle: 'Aspartame - Migraine Trigger',
    warningMessage:
      'Aspartame is a known migraine trigger for many people.',
    geneticBasis: 'Migraine susceptibility',
  },

  // ============================================
  // GOUT / HIGH URIC ACID
  // ============================================
  {
    additives: ['E627', 'E631', 'E635'], // Nucleotide flavor enhancers
    condition: 'goutRisk',
    newRisk: 'avoid',
    severity: 'warning',
    warningTitle: 'Nucleotide Enhancers',
    warningMessage:
      'These flavor enhancers are metabolized to purines and may raise uric acid levels.',
    geneticBasis: 'Gout / High uric acid',
  },

  // ============================================
  // ASPIRIN/SALICYLATE SENSITIVITY
  // ============================================
  {
    additives: ['E102', 'E110', 'E124'], // Azo dyes
    condition: 'aspirinSensitive',
    newRisk: 'avoid',
    severity: 'warning',
    warningTitle: 'Azo Dye - Cross Reaction',
    warningMessage:
      'These colorings can trigger reactions in aspirin-sensitive individuals.',
    geneticBasis: 'Aspirin/salicylate sensitivity',
  },
  {
    additives: ['E210', 'E211', 'E212'], // Benzoates
    condition: 'aspirinSensitive',
    newRisk: 'avoid',
    severity: 'warning',
    warningTitle: 'Benzoate Preservatives',
    warningMessage:
      'Benzoates may trigger reactions in aspirin-sensitive people.',
    geneticBasis: 'Aspirin/salicylate sensitivity',
  },

  // ============================================
  // HISTAMINE INTOLERANCE
  // ============================================
  {
    additives: ['E220', 'E221', 'E223', 'E224'], // Sulfites
    condition: 'histamineIntolerant',
    newRisk: 'avoid',
    severity: 'warning',
    warningTitle: 'Sulfites - Histamine',
    warningMessage:
      'Sulfites can trigger histamine-like reactions and worsen histamine intolerance symptoms.',
    geneticBasis: 'Histamine intolerance',
  },

  // ============================================
  // MSG/GLUTAMATE SENSITIVITY
  // ============================================
  {
    additives: ['E621', 'E620', 'E622', 'E623', 'E624', 'E625'],
    condition: 'glutamateSensitive',
    newRisk: 'avoid',
    severity: 'critical',
    warningTitle: 'Contains Glutamates (MSG)',
    warningMessage:
      'You have indicated MSG sensitivity. These additives may cause headaches, flushing, or other symptoms.',
    geneticBasis: 'Glutamate/MSG sensitivity',
  },

  // ============================================
  // ADHD / CHILDREN'S BEHAVIOR
  // ============================================
  {
    additives: ['E102', 'E104', 'E110', 'E122', 'E124', 'E129'], // Southampton Six
    condition: 'childWithADHD',
    newRisk: 'avoid',
    severity: 'warning',
    warningTitle: 'Southampton Six Coloring',
    warningMessage:
      'These colorings are linked to hyperactivity in children. EU requires warning labels.',
    geneticBasis: 'Child with ADHD/hyperactivity concerns',
  },
  {
    additives: ['E211'], // Sodium benzoate
    condition: 'childWithADHD',
    newRisk: 'avoid',
    severity: 'warning',
    warningTitle: 'Sodium Benzoate',
    warningMessage:
      'Sodium benzoate combined with certain colorings may increase hyperactivity.',
    geneticBasis: 'Child with ADHD/hyperactivity concerns',
  },

  // ============================================
  // CARDIOVASCULAR RISK
  // ============================================
  {
    additives: ['E249', 'E250', 'E251', 'E252'], // Nitrites/Nitrates
    condition: 'cardiovascularRisk',
    newRisk: 'avoid',
    severity: 'warning',
    warningTitle: 'Nitrites/Nitrates',
    warningMessage:
      'Nitrites form compounds linked to cardiovascular harm. Limit processed meats.',
    geneticBasis: 'Cardiovascular risk (9p21 or other variants)',
  },
  {
    additives: ['E471'], // Mono/diglycerides (may contain trans fats)
    condition: 'cardiovascularRisk',
    newRisk: 'moderate',
    severity: 'caution',
    warningTitle: 'May Contain Trans Fats',
    warningMessage:
      'Mono/diglycerides may contain small amounts of trans fats. Watch intake.',
    geneticBasis: 'Cardiovascular risk',
  },
];

/**
 * Apply personalized rules to a list of additives.
 *
 * @param additives - Array of additive codes
 * @param conditions - User's health conditions
 * @returns Array of personalized warnings
 */
export function applyPersonalizedAdditiveRules(
  additives: string[],
  conditions: Partial<AdditiveGeneticConditions>
): PersonalizedAdditiveWarning[] {
  const warnings: PersonalizedAdditiveWarning[] = [];
  const normalizedAdditives = additives.map((a) =>
    a.toUpperCase().replace('-', '').replace(/\s/g, '')
  );

  for (const rule of PERSONALIZED_ADDITIVE_RULES) {
    // Check if condition applies
    const conditionKey = rule.condition as keyof AdditiveGeneticConditions;
    if (!conditions[conditionKey]) continue;

    // Check if any of the rule's additives are present
    for (const ruleAdditive of rule.additives) {
      if (normalizedAdditives.includes(ruleAdditive)) {
        const originalAdditive = getAdditive(ruleAdditive);
        warnings.push({
          additive: ruleAdditive,
          rule,
          originalRisk: originalAdditive?.risk || 'moderate',
        });
      }
    }
  }

  // Sort by severity
  const severityOrder: Record<WarningSeverity, number> = {
    critical: 0,
    warning: 1,
    caution: 2,
    info: 3,
  };

  // Deduplicate warnings for the same additive (keep highest severity)
  const uniqueWarnings = new Map<string, PersonalizedAdditiveWarning>();
  for (const warning of warnings) {
    const existing = uniqueWarnings.get(warning.additive);
    if (
      !existing ||
      severityOrder[warning.rule.severity] < severityOrder[existing.rule.severity]
    ) {
      uniqueWarnings.set(warning.additive, warning);
    }
  }

  return Array.from(uniqueWarnings.values()).sort(
    (a, b) => severityOrder[a.rule.severity] - severityOrder[b.rule.severity]
  );
}

/**
 * Get the personalized risk level for an additive.
 *
 * @param code - Additive code
 * @param conditions - User's health conditions
 * @returns Personalized risk level, or original if no rule applies
 */
export function getPersonalizedAdditiveRisk(
  code: string,
  conditions: Partial<AdditiveGeneticConditions>
): {
  risk: AdditiveRisk;
  isPersonalized: boolean;
  reason?: string;
} {
  const normalizedCode = code.toUpperCase().replace('-', '').replace(/\s/g, '');
  const originalAdditive = getAdditive(normalizedCode);
  const originalRisk = originalAdditive?.risk || 'moderate';

  for (const rule of PERSONALIZED_ADDITIVE_RULES) {
    const conditionKey = rule.condition as keyof AdditiveGeneticConditions;
    if (!conditions[conditionKey]) continue;

    if (rule.additives.includes(normalizedCode)) {
      return {
        risk: rule.newRisk,
        isPersonalized: true,
        reason: rule.geneticBasis,
      };
    }
  }

  return {
    risk: originalRisk,
    isPersonalized: false,
  };
}

/**
 * Check if any critical personalized warnings exist.
 */
export function hasCriticalPersonalizedWarnings(
  additives: string[],
  conditions: Partial<AdditiveGeneticConditions>
): boolean {
  const warnings = applyPersonalizedAdditiveRules(additives, conditions);
  return warnings.some((w) => w.rule.severity === 'critical');
}

/**
 * Get severity colors for personalized warnings.
 */
export function getPersonalizedWarningSeverityColors(severity: WarningSeverity): {
  bg: string;
  border: string;
  text: string;
  badge: string;
} {
  switch (severity) {
    case 'critical':
      return {
        bg: 'bg-red-50',
        border: 'border-red-300',
        text: 'text-red-800',
        badge: 'bg-red-100 text-red-800',
      };
    case 'warning':
      return {
        bg: 'bg-orange-50',
        border: 'border-orange-300',
        text: 'text-orange-800',
        badge: 'bg-orange-100 text-orange-800',
      };
    case 'caution':
      return {
        bg: 'bg-yellow-50',
        border: 'border-yellow-300',
        text: 'text-yellow-800',
        badge: 'bg-yellow-100 text-yellow-800',
      };
    case 'info':
    default:
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-300',
        text: 'text-blue-800',
        badge: 'bg-blue-100 text-blue-800',
      };
  }
}
