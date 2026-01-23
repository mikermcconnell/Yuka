import { AdditiveRisk, ResolvedAdditive, AdditiveFunction } from '@/types';
import { getAdditive, ADDITIVES } from './additives';
import { getAdditiveFunctions } from './additiveFunctions';
import { getAdditiveFromTaxonomy, getCachedTaxonomy } from '@/lib/api/additiveTaxonomy';

/**
 * Additive Resolver (Feature 6)
 *
 * Unified additive lookup with priority:
 * 1. Local database (our curated data)
 * 2. Cached API data (previously fetched from Open Food Facts)
 * 3. Fresh API fetch (when not in cache)
 * 4. Fallback (minimal data for unknown additives)
 */

/**
 * Map EFSA risk levels to our risk classification.
 */
function mapEfsaRiskToOurs(efsaRisk: 'high' | 'moderate' | 'low' | 'none' | undefined): AdditiveRisk {
  switch (efsaRisk) {
    case 'high':
      return 'avoid';
    case 'moderate':
      return 'moderate';
    case 'low':
    case 'none':
      return 'safe';
    default:
      return 'moderate'; // Default to moderate for unknown
  }
}

/**
 * Map additive classes from taxonomy to our function types.
 */
function mapAdditiveClasses(classes: string[] | undefined): AdditiveFunction[] {
  if (!classes || classes.length === 0) return ['other'];

  const classMap: Record<string, AdditiveFunction> = {
    preservative: 'preservative',
    preservatives: 'preservative',
    colour: 'coloring',
    color: 'coloring',
    colours: 'coloring',
    colors: 'coloring',
    sweetener: 'sweetener',
    sweeteners: 'sweetener',
    'flavour enhancer': 'flavor_enhancer',
    'flavor enhancer': 'flavor_enhancer',
    emulsifier: 'emulsifier',
    emulsifiers: 'emulsifier',
    thickener: 'thickener',
    thickeners: 'thickener',
    stabiliser: 'stabilizer',
    stabilizer: 'stabilizer',
    stabilisers: 'stabilizer',
    stabilizers: 'stabilizer',
    antioxidant: 'antioxidant',
    antioxidants: 'antioxidant',
    'acidity regulator': 'acidity_regulator',
    'acidity regulators': 'acidity_regulator',
    'raising agent': 'raising_agent',
    'raising agents': 'raising_agent',
    'glazing agent': 'glazing_agent',
    'glazing agents': 'glazing_agent',
    'anti-caking agent': 'anti_caking',
    'anti-caking agents': 'anti_caking',
    humectant: 'humectant',
    humectants: 'humectant',
    'foaming agent': 'foaming_agent',
    'foaming agents': 'foaming_agent',
  };

  const mapped: AdditiveFunction[] = [];
  for (const cls of classes) {
    const normalized = cls.toLowerCase().trim();
    if (classMap[normalized]) {
      mapped.push(classMap[normalized]);
    }
  }

  return mapped.length > 0 ? mapped : ['other'];
}

/**
 * Resolve an additive code to full data.
 * Uses priority: Local DB > Cached API > Fresh API > Fallback
 *
 * @param code - The additive code (e.g., 'E300', 'e300', 'E-300')
 * @returns Promise<ResolvedAdditive> - Full additive data with source info
 */
export async function resolveAdditive(code: string): Promise<ResolvedAdditive> {
  const normalizedCode = code.toUpperCase().replace('-', '').replace(/\s/g, '');

  // 1. Try local database first (highest priority)
  const localAdditive = getAdditive(normalizedCode);
  if (localAdditive) {
    const functions = getAdditiveFunctions(normalizedCode);
    return {
      code: normalizedCode,
      name: localAdditive.name,
      risk: localAdditive.risk,
      description: localAdditive.description,
      concerns: localAdditive.concerns,
      functions,
      source: 'local',
    };
  }

  // 2. Try cached API data
  const cachedTaxonomy = getCachedTaxonomy();
  if (cachedTaxonomy && cachedTaxonomy[normalizedCode]) {
    const cached = cachedTaxonomy[normalizedCode];
    return {
      code: normalizedCode,
      name: cached.name,
      risk: mapEfsaRiskToOurs(cached.efsaRisk),
      description: cached.description,
      functions: mapAdditiveClasses(cached.additiveClasses),
      vegan: cached.vegan,
      vegetarian: cached.vegetarian,
      efsaUrl: cached.efsaEvaluationUrl,
      source: 'cached_api',
    };
  }

  // 3. Try fresh API fetch
  try {
    const apiData = await getAdditiveFromTaxonomy(normalizedCode);
    if (apiData) {
      return {
        code: normalizedCode,
        name: apiData.name,
        risk: mapEfsaRiskToOurs(apiData.efsaRisk),
        description: apiData.description,
        functions: mapAdditiveClasses(apiData.additiveClasses),
        vegan: apiData.vegan,
        vegetarian: apiData.vegetarian,
        efsaUrl: apiData.efsaEvaluationUrl,
        source: 'fresh_api',
      };
    }
  } catch (error) {
    console.warn(`Failed to fetch additive ${normalizedCode} from API:`, error);
  }

  // 4. Fallback for completely unknown additives
  return {
    code: normalizedCode,
    name: `Additive ${normalizedCode}`,
    risk: 'moderate', // Default to moderate for unknown
    description: 'Unknown additive - no data available',
    functions: ['other'],
    source: 'fallback',
  };
}

/**
 * Resolve an additive synchronously (using only local DB and cache).
 * Use this when you can't await (e.g., in render functions).
 */
export function resolveAdditiveSync(code: string): ResolvedAdditive {
  const normalizedCode = code.toUpperCase().replace('-', '').replace(/\s/g, '');

  // 1. Try local database first
  const localAdditive = getAdditive(normalizedCode);
  if (localAdditive) {
    const functions = getAdditiveFunctions(normalizedCode);
    return {
      code: normalizedCode,
      name: localAdditive.name,
      risk: localAdditive.risk,
      description: localAdditive.description,
      concerns: localAdditive.concerns,
      functions,
      source: 'local',
    };
  }

  // 2. Try cached API data
  const cachedTaxonomy = getCachedTaxonomy();
  if (cachedTaxonomy && cachedTaxonomy[normalizedCode]) {
    const cached = cachedTaxonomy[normalizedCode];
    return {
      code: normalizedCode,
      name: cached.name,
      risk: mapEfsaRiskToOurs(cached.efsaRisk),
      description: cached.description,
      functions: mapAdditiveClasses(cached.additiveClasses),
      vegan: cached.vegan,
      vegetarian: cached.vegetarian,
      efsaUrl: cached.efsaEvaluationUrl,
      source: 'cached_api',
    };
  }

  // 3. Fallback
  return {
    code: normalizedCode,
    name: `Additive ${normalizedCode}`,
    risk: 'moderate',
    description: 'Unknown additive - no data available',
    functions: ['other'],
    source: 'fallback',
  };
}

/**
 * Resolve multiple additives at once.
 * More efficient than calling resolveAdditive multiple times.
 */
export async function resolveAdditives(codes: string[]): Promise<ResolvedAdditive[]> {
  const results = await Promise.all(codes.map((code) => resolveAdditive(code)));
  return results;
}

/**
 * Resolve multiple additives synchronously.
 */
export function resolveAdditivesSync(codes: string[]): ResolvedAdditive[] {
  return codes.map((code) => resolveAdditiveSync(code));
}

/**
 * Check if an additive is in our local database.
 */
export function isInLocalDatabase(code: string): boolean {
  const normalizedCode = code.toUpperCase().replace('-', '').replace(/\s/g, '');
  return normalizedCode in ADDITIVES;
}

/**
 * Get the data source for an additive.
 */
export function getAdditiveSource(
  code: string
): 'local' | 'cached_api' | 'unknown' {
  const normalizedCode = code.toUpperCase().replace('-', '').replace(/\s/g, '');

  if (normalizedCode in ADDITIVES) {
    return 'local';
  }

  const cachedTaxonomy = getCachedTaxonomy();
  if (cachedTaxonomy && cachedTaxonomy[normalizedCode]) {
    return 'cached_api';
  }

  return 'unknown';
}
