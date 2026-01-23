import { Product, Nutriments } from '@/types';
import { calculateHealthScore } from '../scoring/healthScore';

const SEARCH_API_URL = 'https://world.openfoodfacts.org/cgi/search.pl';
const CACHE_KEY_PREFIX = 'off_alternatives_';
const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours

/**
 * Represents a healthier alternative product
 */
export interface Alternative {
  barcode: string;
  name: string;
  brand?: string;
  imageUrl?: string;
  healthScore: number;
  scoreDifference: number;
  improvements: string[];
  availableInCanada: boolean;
  countries: string[];
  nutriments: Nutriments;
}

interface CachedAlternatives {
  data: Alternative[];
  timestamp: number;
}

interface OpenFoodFactsSearchResponse {
  count: number;
  page: number;
  page_size: number;
  products: OpenFoodFactsSearchProduct[];
}

interface OpenFoodFactsSearchProduct {
  code: string;
  product_name?: string;
  brands?: string;
  image_front_small_url?: string;
  image_front_url?: string;
  image_url?: string;
  nutriments?: Nutriments;
  nutrition_grades?: string;
  nova_group?: number;
  categories_tags?: string[];
  labels_tags?: string[];
  additives_tags?: string[];
  countries_tags?: string[];
}

/**
 * Get cached alternatives for a product
 */
function getCachedAlternatives(cacheKey: string): Alternative[] | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(`${CACHE_KEY_PREFIX}${cacheKey}`);
    if (!cached) return null;

    const parsed: CachedAlternatives = JSON.parse(cached);
    if (Date.now() - parsed.timestamp > CACHE_DURATION) {
      localStorage.removeItem(`${CACHE_KEY_PREFIX}${cacheKey}`);
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
}

/**
 * Cache alternatives for a product
 */
function setCachedAlternatives(cacheKey: string, data: Alternative[]): void {
  if (typeof window === 'undefined') return;

  try {
    const cached: CachedAlternatives = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(`${CACHE_KEY_PREFIX}${cacheKey}`, JSON.stringify(cached));
  } catch {
    // Ignore cache errors
  }
}

/**
 * Parse country tags to check if product is available in Canada
 */
function parseCountries(tags?: string[]): { countries: string[]; availableInCanada: boolean } {
  if (!tags || tags.length === 0) {
    return { countries: [], availableInCanada: false };
  }

  const countries = tags.map((tag) =>
    tag
      .replace('en:', '')
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );

  const availableInCanada = tags.some(
    (tag) => tag.toLowerCase().includes('canada') || tag.toLowerCase() === 'en:canada'
  );

  return { countries, availableInCanada };
}

/**
 * Parse additive tags to E-codes
 */
function parseAdditives(tags?: string[]): string[] {
  if (!tags) return [];
  return tags.map((tag) => {
    const match = tag.match(/e(\d+[a-z]?)/i);
    return match ? `E${match[1].toUpperCase()}` : tag.replace('en:', '').toUpperCase();
  });
}

/**
 * Parse label tags
 */
function parseLabels(tags?: string[]): string[] {
  if (!tags) return [];
  return tags.map((tag) =>
    tag
      .replace('en:', '')
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );
}

/**
 * Safely calculate percentage reduction, avoiding division by zero
 * Returns null if calculation is not possible or result is invalid
 */
function safePercentageReduction(currentValue: number | undefined, altValue: number | undefined): number | null {
  // Need both values to be defined and current must be positive to avoid division by zero
  if (
    currentValue === undefined ||
    altValue === undefined ||
    currentValue <= 0 ||
    !Number.isFinite(currentValue) ||
    !Number.isFinite(altValue)
  ) {
    return null;
  }

  const reduction = ((currentValue - altValue) / currentValue) * 100;

  // Validate result is a reasonable finite number
  if (!Number.isFinite(reduction) || reduction < 0 || reduction > 100) {
    return null;
  }

  return reduction;
}

/**
 * Calculate improvements between the current product and an alternative
 */
function calculateImprovements(
  currentProduct: Product,
  alternative: { nutriments: Nutriments; healthScore: number }
): string[] {
  const improvements: string[] = [];
  const current = currentProduct.nutriments;
  const alt = alternative.nutriments;

  // Sugar comparison
  const sugarReduction = safePercentageReduction(current.sugars_100g, alt.sugars_100g);
  if (sugarReduction !== null && sugarReduction >= 20) {
    improvements.push(`${Math.round(sugarReduction)}% less sugar`);
  }

  // Saturated fat comparison
  const satFatReduction = safePercentageReduction(current['saturated-fat_100g'], alt['saturated-fat_100g']);
  if (satFatReduction !== null && satFatReduction >= 20) {
    improvements.push(`${Math.round(satFatReduction)}% less saturated fat`);
  }

  // Sodium/salt comparison
  const currentSodium = current.sodium_100g ?? (current.salt_100g ? current.salt_100g / 2.5 : undefined);
  const altSodium = alt.sodium_100g ?? (alt.salt_100g ? alt.salt_100g / 2.5 : undefined);
  const sodiumReduction = safePercentageReduction(currentSodium, altSodium);
  if (sodiumReduction !== null && sodiumReduction >= 20) {
    improvements.push(`${Math.round(sodiumReduction)}% less sodium`);
  }

  // Calories comparison
  const currentCal = current['energy-kcal_100g'] ?? (current.energy_100g ? current.energy_100g / 4.184 : undefined);
  const altCal = alt['energy-kcal_100g'] ?? (alt.energy_100g ? alt.energy_100g / 4.184 : undefined);
  const calReduction = safePercentageReduction(currentCal, altCal);
  if (calReduction !== null && calReduction >= 15) {
    improvements.push(`${Math.round(calReduction)}% fewer calories`);
  }

  // Fiber comparison (higher is better)
  if (
    current.fiber_100g !== undefined &&
    alt.fiber_100g !== undefined &&
    Number.isFinite(current.fiber_100g) &&
    Number.isFinite(alt.fiber_100g)
  ) {
    if (alt.fiber_100g > current.fiber_100g && alt.fiber_100g >= 3) {
      improvements.push('More fiber');
    }
  }

  // Protein comparison (higher is better)
  if (
    current.proteins_100g !== undefined &&
    alt.proteins_100g !== undefined &&
    Number.isFinite(current.proteins_100g) &&
    Number.isFinite(alt.proteins_100g)
  ) {
    if (alt.proteins_100g > current.proteins_100g * 1.25) {
      improvements.push('More protein');
    }
  }

  // If no specific improvements found but score is better
  if (improvements.length === 0 && alternative.healthScore > currentProduct.healthScore) {
    const scoreDiff = alternative.healthScore - currentProduct.healthScore;
    improvements.push(`+${scoreDiff} health score`);
  }

  return improvements;
}

/**
 * Search for products by category with optional country filter
 */
async function searchByCategory(
  category: string,
  countryFilter?: string,
  pageSize: number = 20
): Promise<OpenFoodFactsSearchProduct[]> {
  const params = new URLSearchParams({
    action: 'process',
    tagtype_0: 'categories',
    tag_contains_0: 'contains',
    tag_0: category,
    sort_by: 'nutriscore_score',
    page_size: pageSize.toString(),
    json: 'true',
  });

  // Add country filter if specified
  if (countryFilter) {
    params.append('tagtype_1', 'countries');
    params.append('tag_contains_1', 'contains');
    params.append('tag_1', countryFilter);
  }

  try {
    const response = await fetch(`${SEARCH_API_URL}?${params.toString()}`, {
      headers: {
        'User-Agent': 'YukaClone/1.0 (https://github.com/user/yuka-clone)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: OpenFoodFactsSearchResponse = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error searching by category:', error);
    return [];
  }
}

/**
 * Transform search result to Alternative
 */
function transformToAlternative(
  product: OpenFoodFactsSearchProduct,
  currentProduct: Product
): Alternative | null {
  // Skip if no name or same product
  if (!product.product_name || product.code === currentProduct.barcode) {
    return null;
  }

  const nutriments = product.nutriments || {};
  const additives = parseAdditives(product.additives_tags);
  const labels = parseLabels(product.labels_tags);
  const { countries, availableInCanada } = parseCountries(product.countries_tags);

  // Calculate health score
  const { score } = calculateHealthScore({
    nutriments,
    additives,
    novaGroup: product.nova_group,
    labels,
  });

  // Only include if score is higher
  if (score <= currentProduct.healthScore) {
    return null;
  }

  const improvements = calculateImprovements(currentProduct, { nutriments, healthScore: score });

  return {
    barcode: product.code,
    name: product.product_name,
    brand: product.brands,
    imageUrl: product.image_front_small_url || product.image_front_url || product.image_url,
    healthScore: score,
    scoreDifference: score - currentProduct.healthScore,
    improvements,
    availableInCanada,
    countries,
    nutriments,
  };
}

/**
 * Fetch better alternatives for a product
 * Prioritizes products available in Canada
 */
export async function fetchBetterAlternatives(
  product: Product,
  maxResults: number = 5
): Promise<Alternative[]> {
  // Need at least one category to search
  if (!product.categories || product.categories.length === 0) {
    return [];
  }

  // Use first category for search (most specific)
  const category = product.categories[0].toLowerCase().replace(/\s+/g, '-');
  const cacheKey = `${category}_${product.barcode}`;

  // Check cache
  const cached = getCachedAlternatives(cacheKey);
  if (cached) {
    return cached;
  }

  // If product already has a good score, skip search
  if (product.healthScore >= 75) {
    return [];
  }

  try {
    // First: Search for Canadian products
    const canadianProducts = await searchByCategory(category, 'canada', 15);
    const canadianAlternatives = canadianProducts
      .map((p) => transformToAlternative(p, product))
      .filter((a): a is Alternative => a !== null)
      .sort((a, b) => b.healthScore - a.healthScore);

    let alternatives = canadianAlternatives;

    // If we have fewer than 3 Canadian alternatives, search internationally
    if (canadianAlternatives.length < 3) {
      const internationalProducts = await searchByCategory(category, undefined, 15);
      const internationalAlternatives = internationalProducts
        .map((p) => transformToAlternative(p, product))
        .filter((a): a is Alternative => a !== null)
        // Filter out products we already have from Canadian search
        .filter((a) => !canadianAlternatives.some((ca) => ca.barcode === a.barcode))
        .sort((a, b) => b.healthScore - a.healthScore);

      // Merge: Canadian first, then international
      alternatives = [
        ...canadianAlternatives,
        ...internationalAlternatives.slice(0, maxResults - canadianAlternatives.length),
      ];
    }

    // Sort final list: Canada + high score first
    alternatives.sort((a, b) => {
      // First priority: Available in Canada
      if (a.availableInCanada !== b.availableInCanada) {
        return a.availableInCanada ? -1 : 1;
      }
      // Second priority: Higher health score
      return b.healthScore - a.healthScore;
    });

    // Limit results
    const results = alternatives.slice(0, maxResults);

    // Cache results
    setCachedAlternatives(cacheKey, results);

    return results;
  } catch (error) {
    console.error('Error fetching alternatives:', error);
    return [];
  }
}

/**
 * Clear alternatives cache
 */
export function clearAlternativesCache(): void {
  if (typeof window === 'undefined') return;

  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith(CACHE_KEY_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
}
