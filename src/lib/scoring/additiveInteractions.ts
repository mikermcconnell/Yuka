import { AdditiveInteraction, InteractionWarning, WarningSeverity } from '@/types';

/**
 * Additive Interaction Warnings (Feature 4)
 *
 * Detects when combinations of additives may create additional risks
 * beyond their individual effects.
 */

/**
 * Known additive interactions with documented concerns.
 */
export const KNOWN_INTERACTIONS: AdditiveInteraction[] = [
  // ============================================
  // BENZENE FORMATION
  // ============================================
  {
    id: 'benzene-formation',
    additives: ['E211', 'E300'], // Sodium benzoate + Vitamin C
    type: 'formation',
    severity: 'warning',
    title: 'Benzene Formation Risk',
    description:
      'When sodium benzoate (E211) combines with vitamin C (E300), it can form small amounts of benzene, a known carcinogen. This reaction is accelerated by heat and light.',
    resultingCompound: 'Benzene',
    scientificBasis:
      'FDA studies found benzene in some beverages at levels above drinking water standards. Reformulation has reduced this risk in most products.',
  },
  {
    id: 'benzene-formation-alt',
    additives: ['E212', 'E300'], // Potassium benzoate + Vitamin C
    type: 'formation',
    severity: 'warning',
    title: 'Benzene Formation Risk',
    description:
      'Potassium benzoate (E212) can also react with vitamin C to form benzene, similar to sodium benzoate.',
    resultingCompound: 'Benzene',
    scientificBasis: 'Same mechanism as sodium benzoate + ascorbic acid reaction.',
  },
  {
    id: 'benzene-benzoic-ascorbic',
    additives: ['E210', 'E300'], // Benzoic acid + Vitamin C
    type: 'formation',
    severity: 'warning',
    title: 'Benzene Formation Risk',
    description:
      'Benzoic acid (E210) can react with vitamin C in acidic conditions to form benzene.',
    resultingCompound: 'Benzene',
    scientificBasis: 'Benzoic acid is the parent compound that forms benzene with ascorbic acid.',
  },

  // ============================================
  // SOUTHAMPTON SIX COMBINATIONS
  // ============================================
  {
    id: 'southampton-six-multi',
    additives: ['E102', 'E104', 'E110', 'E122', 'E124', 'E129'],
    type: 'amplification',
    severity: 'warning',
    title: 'Multiple Southampton Six Colorings',
    description:
      'This product contains multiple colorings from the Southampton Six - additives linked to hyperactivity in children. Combined effects may be amplified.',
    scientificBasis:
      '2007 Southampton University study found these six colorings plus sodium benzoate increased hyperactivity in children.',
  },
  {
    id: 'southampton-benzoate',
    additives: ['E102', 'E211'], // Tartrazine + Sodium Benzoate
    type: 'synergy',
    severity: 'caution',
    title: 'Hyperactivity Combination',
    description:
      'The Southampton study specifically tested combinations of colorings with sodium benzoate (E211), finding increased hyperactivity effects.',
    scientificBasis: 'McCann et al. (2007) study tested specific mixtures.',
  },
  {
    id: 'southampton-mix-a',
    additives: ['E110', 'E211'], // Sunset Yellow + Sodium Benzoate
    type: 'synergy',
    severity: 'caution',
    title: 'Hyperactivity Combination',
    description:
      'Sunset Yellow combined with sodium benzoate was part of the Southampton study mixtures showing hyperactivity effects.',
    scientificBasis: 'Part of Mix A in the Southampton study.',
  },
  {
    id: 'southampton-mix-b',
    additives: ['E129', 'E211'], // Allura Red + Sodium Benzoate
    type: 'synergy',
    severity: 'caution',
    title: 'Hyperactivity Combination',
    description:
      'Allura Red combined with sodium benzoate was tested in the Southampton study.',
    scientificBasis: 'Part of Mix B in the Southampton study.',
  },

  // ============================================
  // NITRITE COMBINATIONS
  // ============================================
  {
    id: 'nitrite-amine',
    additives: ['E250', 'E621'], // Sodium nitrite + MSG
    type: 'formation',
    severity: 'caution',
    title: 'Processed Meat Markers',
    description:
      'Both nitrites and MSG are common in highly processed meats. This combination is a marker of ultra-processed food.',
    scientificBasis: 'Both additives commonly appear together in processed meats and snacks.',
  },
  {
    id: 'multiple-nitrites',
    additives: ['E249', 'E250', 'E251', 'E252'],
    type: 'amplification',
    severity: 'warning',
    title: 'Multiple Nitrite/Nitrate Sources',
    description:
      'This product contains multiple forms of nitrites/nitrates. Combined exposure increases nitrosamine formation risk.',
    scientificBasis:
      'WHO/IARC classifies processed meats as carcinogenic partly due to nitrosamine formation.',
  },

  // ============================================
  // ARTIFICIAL SWEETENER COMBINATIONS
  // ============================================
  {
    id: 'sweetener-cocktail',
    additives: ['E950', 'E951'], // Acesulfame K + Aspartame
    type: 'synergy',
    severity: 'caution',
    title: 'Multiple Artificial Sweeteners',
    description:
      'Contains multiple artificial sweeteners. While combined for taste, cumulative effects on gut bacteria and metabolism may be greater.',
    scientificBasis:
      'Studies suggest artificial sweeteners affect gut microbiome; combined effects are less studied.',
  },
  {
    id: 'sweetener-triple',
    additives: ['E950', 'E951', 'E955'], // Ace-K + Aspartame + Sucralose
    type: 'synergy',
    severity: 'warning',
    title: 'Artificial Sweetener Cocktail',
    description:
      'Contains three different artificial sweeteners. The combined effects of multiple sweeteners are not well studied.',
    scientificBasis:
      'Individual sweetener safety does not necessarily predict safety of combinations.',
  },

  // ============================================
  // EMULSIFIER COMBINATIONS
  // ============================================
  {
    id: 'emulsifier-combo',
    additives: ['E433', 'E466'], // Polysorbate 80 + CMC
    type: 'synergy',
    severity: 'caution',
    title: 'Emulsifier Combination',
    description:
      'Contains multiple emulsifiers that may affect gut bacteria. Studies suggest emulsifiers can promote inflammation.',
    scientificBasis:
      '2015 Nature study found dietary emulsifiers altered gut microbiota and promoted inflammation in mice.',
  },
  {
    id: 'emulsifier-triple',
    additives: ['E433', 'E466', 'E407'], // Polysorbate 80 + CMC + Carrageenan
    type: 'synergy',
    severity: 'warning',
    title: 'Multiple Gut-Affecting Emulsifiers',
    description:
      'Contains several emulsifiers linked to gut inflammation. People with digestive issues may want to limit intake.',
    scientificBasis:
      'Each of these emulsifiers has been individually linked to gut microbiome effects.',
  },

  // ============================================
  // PHOSPHATE OVERLOAD
  // ============================================
  {
    id: 'phosphate-overload',
    additives: ['E338', 'E450', 'E451', 'E452'],
    type: 'amplification',
    severity: 'warning',
    title: 'High Phosphate Load',
    description:
      'Contains multiple phosphate additives. High phosphate intake is linked to cardiovascular risk, especially for those with kidney issues.',
    scientificBasis:
      'EFSA re-evaluation noted concerns about total dietary phosphate exposure from additives.',
  },

  // ============================================
  // SULFITE COMBINATIONS
  // ============================================
  {
    id: 'sulfite-load',
    additives: ['E220', 'E221', 'E223', 'E224'],
    type: 'amplification',
    severity: 'warning',
    title: 'Multiple Sulfite Sources',
    description:
      'Contains multiple sulfite preservatives. People with asthma or sulfite sensitivity should be cautious.',
    scientificBasis:
      '5-10% of asthmatics are sulfite-sensitive. Cumulative sulfite exposure increases reaction risk.',
  },

  // ============================================
  // PRESERVATIVE COMBINATIONS
  // ============================================
  {
    id: 'preservative-heavy',
    additives: ['E211', 'E202', 'E282'],
    type: 'synergy',
    severity: 'caution',
    title: 'Heavy Preservative Use',
    description:
      'Contains multiple preservative systems. This indicates a highly processed product designed for long shelf life.',
    scientificBasis:
      'Multiple preservatives are typically found in ultra-processed foods.',
  },

  // ============================================
  // FLAVOR ENHANCER COMBINATIONS
  // ============================================
  {
    id: 'umami-bomb',
    additives: ['E621', 'E627', 'E631'],
    type: 'synergy',
    severity: 'caution',
    title: 'Multiple Flavor Enhancers',
    description:
      'Contains MSG plus nucleotide enhancers (I+G). This combination dramatically intensifies umami flavor and is common in processed snacks.',
    scientificBasis:
      'E627 and E631 synergize with MSG to enhance flavor perception 10-15 times.',
  },
];

/**
 * Detect interactions between additives in a product.
 *
 * @param additives - Array of additive codes present in the product
 * @returns Array of detected interaction warnings
 */
export function detectInteractions(additives: string[]): InteractionWarning[] {
  const normalizedAdditives = additives.map((a) =>
    a.toUpperCase().replace('-', '').replace(/\s/g, '')
  );

  const warnings: InteractionWarning[] = [];

  for (const interaction of KNOWN_INTERACTIONS) {
    // Check if at least 2 of the interaction's additives are present
    const presentAdditives = interaction.additives.filter((a) =>
      normalizedAdditives.includes(a)
    );

    // For "multi" interactions, require at least 2; for pairs, require both
    const threshold = interaction.additives.length > 2 ? 2 : interaction.additives.length;

    if (presentAdditives.length >= threshold) {
      warnings.push({
        ...interaction,
        detectedAdditives: presentAdditives,
      });
    }
  }

  // Sort by severity
  const severityOrder: Record<WarningSeverity, number> = {
    critical: 0,
    warning: 1,
    caution: 2,
    info: 3,
  };

  return warnings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}

/**
 * Check if any critical interactions exist.
 */
export function hasCriticalInteractions(additives: string[]): boolean {
  const warnings = detectInteractions(additives);
  return warnings.some((w) => w.severity === 'critical' || w.severity === 'warning');
}

/**
 * Get a summary of interaction concerns.
 */
export function getInteractionSummary(additives: string[]): {
  warningCount: number;
  cautionCount: number;
  highestSeverity: WarningSeverity | null;
  summary: string;
} {
  const warnings = detectInteractions(additives);

  if (warnings.length === 0) {
    return {
      warningCount: 0,
      cautionCount: 0,
      highestSeverity: null,
      summary: 'No known additive interactions detected.',
    };
  }

  const warningCount = warnings.filter(
    (w) => w.severity === 'warning' || w.severity === 'critical'
  ).length;
  const cautionCount = warnings.filter((w) => w.severity === 'caution').length;

  const highestSeverity = warnings[0].severity; // Already sorted

  let summary: string;
  if (warningCount > 0) {
    summary = `${warningCount} significant additive interaction${warningCount > 1 ? 's' : ''} detected.`;
  } else {
    summary = `${cautionCount} minor interaction${cautionCount > 1 ? 's' : ''} noted.`;
  }

  return {
    warningCount,
    cautionCount,
    highestSeverity,
    summary,
  };
}

/**
 * Get color classes for interaction severity.
 */
export function getInteractionColors(severity: WarningSeverity): {
  bg: string;
  border: string;
  text: string;
  icon: string;
} {
  switch (severity) {
    case 'critical':
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-700',
        icon: 'text-red-500',
      };
    case 'warning':
      return {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-700',
        icon: 'text-orange-500',
      };
    case 'caution':
      return {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-700',
        icon: 'text-yellow-500',
      };
    case 'info':
    default:
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        icon: 'text-blue-500',
      };
  }
}
