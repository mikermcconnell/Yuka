import { ExternalAdditiveData } from '@/types';

/**
 * Open Food Facts Additive Taxonomy API Client (Feature 6)
 *
 * Fetches and caches additive data from the Open Food Facts taxonomy.
 * Provides fallback data when API is unavailable.
 */

const TAXONOMY_URL = 'https://static.openfoodfacts.org/data/taxonomies/additives.json';
const CACHE_KEY = 'off_additive_taxonomy';
const CACHE_TIMESTAMP_KEY = 'off_additive_taxonomy_timestamp';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// In-memory cache for current session
let memoryCache: Record<string, ExternalAdditiveData> | null = null;

/**
 * Raw structure from Open Food Facts taxonomy
 */
interface OFFTaxonomyEntry {
  name?: Record<string, string>;
  parents?: string[];
  wikidata?: Record<string, string>;
  efsa_evaluation_overexposure_risk?: Record<string, string>;
  efsa_evaluation_url?: Record<string, string>;
  additives_classes?: Record<string, string>;
  vegan?: Record<string, string>;
  vegetarian?: Record<string, string>;
  description?: Record<string, string>;
}

/**
 * Map EFSA risk levels from the taxonomy to our risk system.
 */
function mapEfsaRisk(
  efsaRisk: string | undefined
): 'high' | 'moderate' | 'low' | 'none' | undefined {
  if (!efsaRisk) return undefined;

  const normalizedRisk = efsaRisk.toLowerCase();

  if (normalizedRisk.includes('high')) return 'high';
  if (normalizedRisk.includes('moderate')) return 'moderate';
  if (normalizedRisk.includes('low') || normalizedRisk.includes('no risk')) return 'low';
  if (normalizedRisk.includes('no') || normalizedRisk.includes('none')) return 'none';

  return undefined;
}

/**
 * Parse a taxonomy entry into our ExternalAdditiveData format.
 */
function parseTaxonomyEntry(key: string, entry: OFFTaxonomyEntry): ExternalAdditiveData | null {
  // Extract E-number from the key (e.g., "en:e300" -> "E300")
  const codeMatch = key.match(/e(\d+[a-z]?)/i);
  if (!codeMatch) return null;

  const code = `E${codeMatch[1].toUpperCase()}`;
  const name = entry.name?.en || entry.name?.fr || code;

  // Get EFSA risk level
  const efsaRiskRaw =
    entry.efsa_evaluation_overexposure_risk?.en || entry.efsa_evaluation_overexposure_risk?.fr;
  const efsaRisk = mapEfsaRisk(efsaRiskRaw);

  // Get additive classes
  const additiveClasses = entry.additives_classes?.en?.split(',').map((c) => c.trim()) || [];

  // Get vegan/vegetarian status
  const veganStr = entry.vegan?.en?.toLowerCase();
  const vegetarianStr = entry.vegetarian?.en?.toLowerCase();

  return {
    code,
    name,
    efsaRisk,
    additiveClasses,
    vegan: veganStr === 'yes' ? true : veganStr === 'no' ? false : undefined,
    vegetarian: vegetarianStr === 'yes' ? true : vegetarianStr === 'no' ? false : undefined,
    efsaEvaluationUrl: entry.efsa_evaluation_url?.en,
    description: entry.description?.en,
  };
}

/**
 * Check if localStorage is available (may not be in SSR or incognito).
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Save taxonomy data to localStorage cache.
 */
function saveToLocalStorage(data: Record<string, ExternalAdditiveData>): void {
  if (!isLocalStorageAvailable()) return;

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    // Storage quota exceeded or other error
    console.warn('Failed to cache additive taxonomy:', error);
  }
}

/**
 * Load taxonomy data from localStorage cache.
 */
function loadFromLocalStorage(): Record<string, ExternalAdditiveData> | null {
  if (!isLocalStorageAvailable()) return null;

  try {
    const timestampStr = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!timestampStr) return null;

    const timestamp = parseInt(timestampStr, 10);
    if (Date.now() - timestamp > CACHE_DURATION) {
      // Cache expired
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      return null;
    }

    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    return JSON.parse(cached);
  } catch {
    return null;
  }
}

/**
 * Fetch the additive taxonomy from Open Food Facts.
 * Returns a map of E-codes to additive data.
 */
export async function fetchAdditiveTaxonomy(): Promise<Record<string, ExternalAdditiveData>> {
  // Check memory cache first
  if (memoryCache) {
    return memoryCache;
  }

  // Check localStorage cache
  const localCached = loadFromLocalStorage();
  if (localCached) {
    memoryCache = localCached;
    return localCached;
  }

  // Fetch from API
  try {
    const response = await fetch(TAXONOMY_URL, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const rawData: Record<string, OFFTaxonomyEntry> = await response.json();

    // Parse and index by E-code
    const parsed: Record<string, ExternalAdditiveData> = {};

    for (const [key, entry] of Object.entries(rawData)) {
      const additive = parseTaxonomyEntry(key, entry);
      if (additive) {
        parsed[additive.code] = additive;
      }
    }

    // Cache the results
    memoryCache = parsed;
    saveToLocalStorage(parsed);

    return parsed;
  } catch (error) {
    console.error('Failed to fetch additive taxonomy:', error);
    return {};
  }
}

/**
 * Get cached taxonomy without fetching (returns null if not cached).
 */
export function getCachedTaxonomy(): Record<string, ExternalAdditiveData> | null {
  if (memoryCache) return memoryCache;
  return loadFromLocalStorage();
}

/**
 * Get a single additive from the taxonomy.
 * Attempts to use cache first, then fetches if needed.
 */
export async function getAdditiveFromTaxonomy(
  code: string
): Promise<ExternalAdditiveData | null> {
  const normalizedCode = code.toUpperCase().replace('-', '').replace(/\s/g, '');

  // Try memory cache
  if (memoryCache && memoryCache[normalizedCode]) {
    return memoryCache[normalizedCode];
  }

  // Try localStorage cache
  const localCached = loadFromLocalStorage();
  if (localCached && localCached[normalizedCode]) {
    return localCached[normalizedCode];
  }

  // Fetch full taxonomy (will cache it)
  const taxonomy = await fetchAdditiveTaxonomy();
  return taxonomy[normalizedCode] || null;
}

/**
 * Clear the cached taxonomy data.
 */
export function clearTaxonomyCache(): void {
  memoryCache = null;
  if (isLocalStorageAvailable()) {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
  }
}

/**
 * Check if taxonomy is cached and not expired.
 */
export function isTaxonomyCached(): boolean {
  if (memoryCache) return true;
  return loadFromLocalStorage() !== null;
}

/**
 * Pre-fetch the taxonomy in the background.
 * Useful for warming up the cache when the app loads.
 */
export function prefetchTaxonomy(): void {
  // Don't await - let it run in background
  fetchAdditiveTaxonomy().catch(() => {
    // Silently fail - not critical
  });
}
