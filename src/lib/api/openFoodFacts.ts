import { OpenFoodFactsProduct, OpenFoodFactsResponse, Product } from '@/types';
import { calculateHealthScore } from '../scoring/healthScore';

const API_BASE_URL = 'https://world.openfoodfacts.org/api/v0';
const CACHE_KEY_PREFIX = 'off_product_';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CachedProduct {
  data: OpenFoodFactsProduct;
  timestamp: number;
}

function getCachedProduct(barcode: string): OpenFoodFactsProduct | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(`${CACHE_KEY_PREFIX}${barcode}`);
    if (!cached) return null;

    const parsed: CachedProduct = JSON.parse(cached);
    if (Date.now() - parsed.timestamp > CACHE_DURATION) {
      localStorage.removeItem(`${CACHE_KEY_PREFIX}${barcode}`);
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
}

function setCachedProduct(barcode: string, data: OpenFoodFactsProduct): void {
  if (typeof window === 'undefined') return;

  try {
    const cached: CachedProduct = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(`${CACHE_KEY_PREFIX}${barcode}`, JSON.stringify(cached));
  } catch {
    // Ignore cache errors (e.g., quota exceeded)
  }
}

export async function fetchProduct(barcode: string): Promise<Product | null> {
  // Check cache first
  const cached = getCachedProduct(barcode);
  if (cached) {
    return transformProduct(cached, barcode);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/product/${barcode}.json`, {
      headers: {
        'User-Agent': 'YukaClone/1.0 (https://github.com/user/yuka-clone)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: OpenFoodFactsResponse = await response.json();

    if (data.status !== 1 || !data.product) {
      return null;
    }

    // Cache the result
    setCachedProduct(barcode, data.product);

    return transformProduct(data.product, barcode);
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

export async function searchProducts(
  query: string,
  page: number = 1,
  pageSize: number = 20
): Promise<{ products: Product[]; count: number; page: number }> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}&json=true`,
      {
        headers: {
          'User-Agent': 'YukaClone/1.0 (https://github.com/user/yuka-clone)',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const products = (data.products || [])
      .filter((p: OpenFoodFactsProduct) => p.product_name)
      .map((p: OpenFoodFactsProduct) => transformProduct(p, p.code));

    return {
      products,
      count: data.count || 0,
      page: data.page || 1,
    };
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}

function transformProduct(
  offProduct: OpenFoodFactsProduct,
  barcode: string
): Product {
  const nutriments = offProduct.nutriments || {};
  const additives = parseAdditives(offProduct.additives_tags);
  const allergens = parseAllergens(offProduct.allergens_tags);
  const categories = parseCategories(offProduct.categories_tags);
  const labels = parseLabels(offProduct.labels_tags);

  const { score, breakdown } = calculateHealthScore({
    nutriments,
    additives,
    novaGroup: offProduct.nova_group,
    labels,
  });

  return {
    barcode,
    name: offProduct.product_name || 'Unknown Product',
    brand: offProduct.brands,
    imageUrl: offProduct.image_front_url || offProduct.image_url,
    nutriments,
    nutritionGrade: offProduct.nutrition_grades?.toUpperCase(),
    novaGroup: offProduct.nova_group,
    ingredients: offProduct.ingredients_text,
    additives,
    allergens,
    categories,
    labels,
    quantity: offProduct.quantity,
    servingSize: offProduct.serving_size,
    healthScore: score,
    scoreBreakdown: breakdown,
  };
}

// Shared tag parsing utility - converts "en:some-tag" to "Some Tag"
function parseTags(tags?: string[], limit?: number): string[] {
  if (!tags) return [];
  const items = limit ? tags.slice(0, limit) : tags;
  return items.map((tag) =>
    tag
      .replace('en:', '')
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );
}

function parseAdditives(tags?: string[]): string[] {
  if (!tags) return [];
  return tags.map((tag) => {
    // Convert en:e300 to E300
    const match = tag.match(/e(\d+[a-z]?)/i);
    return match ? `E${match[1].toUpperCase()}` : tag.replace('en:', '').toUpperCase();
  });
}

const parseAllergens = (tags?: string[]) => parseTags(tags);
const parseCategories = (tags?: string[]) => parseTags(tags, 5);
const parseLabels = (tags?: string[]) => parseTags(tags);

export function clearProductCache(): void {
  if (typeof window === 'undefined') return;

  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith(CACHE_KEY_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
}
