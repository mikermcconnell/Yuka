import { AdditiveFunction, AdditiveFunctionInfo, Additive } from '@/types';
import { getAdditive } from './additives';

/**
 * Additive Categories/Functions (Feature 7)
 *
 * Maps each E-number to its functional categories (preservative, coloring, etc.)
 * and provides grouping utilities for the UI.
 */

// Function metadata for display
export const ADDITIVE_FUNCTION_INFO: Record<AdditiveFunction, AdditiveFunctionInfo> = {
  preservative: {
    function: 'preservative',
    label: 'Preservatives',
    description: 'Extend shelf life by preventing microbial growth or oxidation',
  },
  coloring: {
    function: 'coloring',
    label: 'Colors',
    description: 'Add or restore color to food products',
  },
  sweetener: {
    function: 'sweetener',
    label: 'Sweeteners',
    description: 'Provide sweetness, often with fewer calories than sugar',
  },
  flavor_enhancer: {
    function: 'flavor_enhancer',
    label: 'Flavor Enhancers',
    description: 'Intensify or improve the taste of food',
  },
  emulsifier: {
    function: 'emulsifier',
    label: 'Emulsifiers',
    description: 'Help oil and water mix together smoothly',
  },
  thickener: {
    function: 'thickener',
    label: 'Thickeners',
    description: 'Increase viscosity and improve texture',
  },
  stabilizer: {
    function: 'stabilizer',
    label: 'Stabilizers',
    description: 'Maintain consistent texture and prevent separation',
  },
  antioxidant: {
    function: 'antioxidant',
    label: 'Antioxidants',
    description: 'Prevent fats and oils from going rancid',
  },
  acidity_regulator: {
    function: 'acidity_regulator',
    label: 'Acidity Regulators',
    description: 'Control or change the acidity/alkalinity of food',
  },
  raising_agent: {
    function: 'raising_agent',
    label: 'Raising Agents',
    description: 'Release gases to make doughs and batters rise',
  },
  glazing_agent: {
    function: 'glazing_agent',
    label: 'Glazing Agents',
    description: 'Provide a shiny coating or protective layer',
  },
  anti_caking: {
    function: 'anti_caking',
    label: 'Anti-caking Agents',
    description: 'Prevent powders from clumping together',
  },
  humectant: {
    function: 'humectant',
    label: 'Humectants',
    description: 'Retain moisture and prevent drying out',
  },
  foaming_agent: {
    function: 'foaming_agent',
    label: 'Foaming Agents',
    description: 'Create or maintain foam in products',
  },
  other: {
    function: 'other',
    label: 'Other',
    description: 'Miscellaneous food additives',
  },
};

/**
 * Mapping of E-numbers to their functions.
 * Many additives serve multiple functions.
 */
export const ADDITIVE_FUNCTION_MAP: Record<string, AdditiveFunction[]> = {
  // Safe additives
  E100: ['coloring'],
  E101: ['coloring'],
  E140: ['coloring'],
  E160A: ['coloring', 'antioxidant'],
  E160C: ['coloring'],
  E162: ['coloring'],
  E163: ['coloring'],
  E170: ['coloring', 'anti_caking'],
  E260: ['preservative', 'acidity_regulator'],
  E270: ['preservative', 'acidity_regulator'],
  E290: ['preservative', 'acidity_regulator'],
  E296: ['acidity_regulator'],
  E300: ['antioxidant', 'preservative'],
  E301: ['antioxidant', 'preservative'],
  E302: ['antioxidant', 'preservative'],
  E304: ['antioxidant'],
  E306: ['antioxidant'],
  E307: ['antioxidant'],
  E308: ['antioxidant'],
  E309: ['antioxidant'],
  E322: ['emulsifier'],
  E325: ['acidity_regulator', 'humectant'],
  E326: ['acidity_regulator'],
  E327: ['acidity_regulator', 'stabilizer'],
  E330: ['acidity_regulator', 'preservative'],
  E331: ['acidity_regulator', 'emulsifier'],
  E332: ['acidity_regulator'],
  E333: ['acidity_regulator', 'stabilizer'],
  E334: ['acidity_regulator'],
  E335: ['acidity_regulator', 'emulsifier'],
  E336: ['acidity_regulator', 'stabilizer'],
  E338: ['acidity_regulator'],
  E375: ['other'], // Vitamin B3
  E392: ['antioxidant'],
  E400: ['thickener', 'stabilizer'],
  E401: ['thickener', 'stabilizer'],
  E406: ['thickener', 'stabilizer'],
  E410: ['thickener', 'stabilizer'],
  E414: ['thickener', 'emulsifier', 'stabilizer'],
  E440: ['thickener', 'stabilizer'],
  E500: ['raising_agent', 'acidity_regulator'],
  E501: ['raising_agent', 'acidity_regulator'],
  E503: ['raising_agent'],
  E504: ['anti_caking', 'acidity_regulator'],
  E508: ['other'], // Salt substitute
  E509: ['stabilizer'],
  E516: ['stabilizer'],
  E524: ['acidity_regulator'],
  E551: ['anti_caking'],
  E901: ['glazing_agent'],
  E903: ['glazing_agent'],
  E920: ['other'], // Dough conditioner

  // Moderate risk additives
  E102: ['coloring'],
  E104: ['coloring'],
  E110: ['coloring'],
  E120: ['coloring'],
  E122: ['coloring'],
  E124: ['coloring'],
  E129: ['coloring'],
  E131: ['coloring'],
  E132: ['coloring'],
  E133: ['coloring'],
  E150A: ['coloring'],
  E150B: ['coloring'],
  E150C: ['coloring'],
  E150D: ['coloring'],
  E200: ['preservative'],
  E202: ['preservative'],
  E210: ['preservative'],
  E211: ['preservative'],
  E212: ['preservative'],
  E220: ['preservative', 'antioxidant'],
  E221: ['preservative'],
  E223: ['preservative', 'antioxidant'],
  E224: ['preservative', 'antioxidant'],
  E234: ['preservative'],
  E280: ['preservative'],
  E281: ['preservative'],
  E282: ['preservative'],
  E320: ['antioxidant'],
  E321: ['antioxidant'],
  E407: ['thickener', 'stabilizer'],
  E412: ['thickener', 'stabilizer'],
  E415: ['thickener', 'stabilizer'],
  E433: ['emulsifier'],
  E450: ['raising_agent', 'stabilizer'],
  E451: ['stabilizer', 'emulsifier'],
  E452: ['stabilizer', 'emulsifier'],
  E460: ['thickener', 'anti_caking'],
  E461: ['thickener', 'emulsifier'],
  E466: ['thickener', 'stabilizer'],
  E471: ['emulsifier'],
  E472E: ['emulsifier'],
  E481: ['emulsifier'],
  E491: ['emulsifier'],
  E621: ['flavor_enhancer'],
  E627: ['flavor_enhancer'],
  E631: ['flavor_enhancer'],
  E635: ['flavor_enhancer'],

  // High risk additives (avoid)
  E123: ['coloring'],
  E127: ['coloring'],
  E128: ['coloring'],
  E142: ['coloring'],
  E151: ['coloring'],
  E154: ['coloring'],
  E155: ['coloring'],
  E173: ['coloring'],
  E180: ['coloring'],
  E239: ['preservative'],
  E249: ['preservative'],
  E250: ['preservative'],
  E251: ['preservative'],
  E252: ['preservative'],
  E284: ['preservative'],
  E285: ['preservative'],
  E385: ['antioxidant'],
  E512: ['antioxidant'],
  E620: ['flavor_enhancer'],
  E622: ['flavor_enhancer'],
  E623: ['flavor_enhancer'],
  E624: ['flavor_enhancer'],
  E625: ['flavor_enhancer'],
  E900: ['foaming_agent'],
  E905: ['glazing_agent'],
  E907: ['glazing_agent'],
  E950: ['sweetener'],
  E951: ['sweetener'],
  E952: ['sweetener'],
  E954: ['sweetener'],
  E955: ['sweetener'],
  E962: ['sweetener'],
  E999: ['foaming_agent'],
};

/**
 * Get the functions/categories for an additive.
 */
export function getAdditiveFunctions(code: string): AdditiveFunction[] {
  const normalizedCode = code.toUpperCase().replace('-', '').replace(/\s/g, '');
  return ADDITIVE_FUNCTION_MAP[normalizedCode] || ['other'];
}

/**
 * Get display info for a function.
 */
export function getFunctionInfo(func: AdditiveFunction): AdditiveFunctionInfo {
  return ADDITIVE_FUNCTION_INFO[func];
}

/**
 * Interface for grouped additives
 */
export interface GroupedAdditives {
  function: AdditiveFunction;
  info: AdditiveFunctionInfo;
  additives: Array<Additive & { functions: AdditiveFunction[] }>;
}

/**
 * Group additives by their primary function.
 * Each additive appears in its primary (first listed) function group.
 */
export function groupAdditivesByFunction(additiveCodes: string[]): GroupedAdditives[] {
  const groups: Map<AdditiveFunction, Array<Additive & { functions: AdditiveFunction[] }>> =
    new Map();

  for (const code of additiveCodes) {
    const additive = getAdditive(code);
    const functions = getAdditiveFunctions(code);
    const primaryFunction = functions[0] || 'other';

    const enrichedAdditive = {
      ...(additive || {
        code: code.toUpperCase(),
        name: 'Unknown Additive',
        risk: 'moderate' as const,
      }),
      functions,
    };

    if (!groups.has(primaryFunction)) {
      groups.set(primaryFunction, []);
    }
    groups.get(primaryFunction)!.push(enrichedAdditive);
  }

  // Convert to array and sort by function priority
  const functionOrder: AdditiveFunction[] = [
    'preservative',
    'coloring',
    'sweetener',
    'flavor_enhancer',
    'emulsifier',
    'thickener',
    'stabilizer',
    'antioxidant',
    'acidity_regulator',
    'raising_agent',
    'glazing_agent',
    'anti_caking',
    'humectant',
    'foaming_agent',
    'other',
  ];

  return functionOrder
    .filter((func) => groups.has(func))
    .map((func) => ({
      function: func,
      info: ADDITIVE_FUNCTION_INFO[func],
      additives: groups.get(func)!,
    }));
}

/**
 * Get all unique functions present in a list of additives.
 */
export function getUniqueFunctions(additiveCodes: string[]): AdditiveFunction[] {
  const functions = new Set<AdditiveFunction>();

  for (const code of additiveCodes) {
    const additiveFunctions = getAdditiveFunctions(code);
    additiveFunctions.forEach((f) => functions.add(f));
  }

  return Array.from(functions);
}

/**
 * Check if any additives in the list match a specific function.
 */
export function hasAdditiveWithFunction(
  additiveCodes: string[],
  targetFunction: AdditiveFunction
): boolean {
  return additiveCodes.some((code) => {
    const functions = getAdditiveFunctions(code);
    return functions.includes(targetFunction);
  });
}

/**
 * Get all additives that match a specific function.
 */
export function getAdditivesByFunction(
  additiveCodes: string[],
  targetFunction: AdditiveFunction
): Additive[] {
  return additiveCodes
    .filter((code) => {
      const functions = getAdditiveFunctions(code);
      return functions.includes(targetFunction);
    })
    .map((code) => getAdditive(code))
    .filter((a): a is Additive => a !== null);
}
