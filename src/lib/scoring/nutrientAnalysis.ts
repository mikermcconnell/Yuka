import { Nutriments, NutrientAnalysis } from '@/types';

// Daily recommended values (for adults)
const DAILY_VALUES = {
  energy: 2000, // kcal
  fat: 65, // g
  saturatedFat: 20, // g
  carbohydrates: 300, // g
  sugars: 50, // g
  fiber: 25, // g
  protein: 50, // g
  salt: 6, // g
  sodium: 2.4, // g
};

export function analyzeNutrients(
  nutriments: Nutriments
): NutrientAnalysis[] {
  const analyses: NutrientAnalysis[] = [];

  // Energy/Calories
  const calories = nutriments['energy-kcal_100g'] || (nutriments.energy_100g ? nutriments.energy_100g / 4.184 : undefined);
  if (calories !== undefined) {
    analyses.push({
      nutrient: 'Calories',
      value: calories,
      unit: 'kcal/100g',
      rating: calories <= 100 ? 'good' : calories <= 300 ? 'moderate' : 'poor',
      percentDV: Math.round((calories / DAILY_VALUES.energy) * 100),
      message: getCaloriesMessage(calories),
    });
  }

  // Fat
  if (nutriments.fat_100g !== undefined) {
    analyses.push({
      nutrient: 'Fat',
      value: nutriments.fat_100g,
      unit: 'g/100g',
      rating: nutriments.fat_100g <= 3 ? 'good' : nutriments.fat_100g <= 17.5 ? 'moderate' : 'poor',
      percentDV: Math.round((nutriments.fat_100g / DAILY_VALUES.fat) * 100),
      message: getFatMessage(nutriments.fat_100g),
    });
  }

  // Saturated Fat
  const satFat = nutriments['saturated-fat_100g'];
  if (satFat !== undefined) {
    analyses.push({
      nutrient: 'Saturated Fat',
      value: satFat,
      unit: 'g/100g',
      rating: satFat <= 1.5 ? 'good' : satFat <= 5 ? 'moderate' : 'poor',
      percentDV: Math.round((satFat / DAILY_VALUES.saturatedFat) * 100),
      message: getSaturatedFatMessage(satFat),
    });
  }

  // Carbohydrates
  if (nutriments.carbohydrates_100g !== undefined) {
    analyses.push({
      nutrient: 'Carbohydrates',
      value: nutriments.carbohydrates_100g,
      unit: 'g/100g',
      rating: 'moderate', // Carbs are context-dependent
      percentDV: Math.round((nutriments.carbohydrates_100g / DAILY_VALUES.carbohydrates) * 100),
      message: `${nutriments.carbohydrates_100g.toFixed(1)}g of carbohydrates per 100g`,
    });
  }

  // Sugars
  if (nutriments.sugars_100g !== undefined) {
    analyses.push({
      nutrient: 'Sugars',
      value: nutriments.sugars_100g,
      unit: 'g/100g',
      rating: nutriments.sugars_100g <= 5 ? 'good' : nutriments.sugars_100g <= 22.5 ? 'moderate' : 'poor',
      percentDV: Math.round((nutriments.sugars_100g / DAILY_VALUES.sugars) * 100),
      message: getSugarMessage(nutriments.sugars_100g),
    });
  }

  // Fiber
  if (nutriments.fiber_100g !== undefined) {
    analyses.push({
      nutrient: 'Fiber',
      value: nutriments.fiber_100g,
      unit: 'g/100g',
      rating: nutriments.fiber_100g >= 6 ? 'good' : nutriments.fiber_100g >= 3 ? 'moderate' : 'poor',
      percentDV: Math.round((nutriments.fiber_100g / DAILY_VALUES.fiber) * 100),
      message: getFiberMessage(nutriments.fiber_100g),
    });
  }

  // Protein
  if (nutriments.proteins_100g !== undefined) {
    analyses.push({
      nutrient: 'Protein',
      value: nutriments.proteins_100g,
      unit: 'g/100g',
      rating: nutriments.proteins_100g >= 12 ? 'good' : nutriments.proteins_100g >= 6 ? 'moderate' : 'poor',
      percentDV: Math.round((nutriments.proteins_100g / DAILY_VALUES.protein) * 100),
      message: getProteinMessage(nutriments.proteins_100g),
    });
  }

  // Salt/Sodium
  const salt = nutriments.salt_100g;
  if (salt !== undefined) {
    analyses.push({
      nutrient: 'Salt',
      value: salt,
      unit: 'g/100g',
      rating: salt <= 0.3 ? 'good' : salt <= 1.5 ? 'moderate' : 'poor',
      percentDV: Math.round((salt / DAILY_VALUES.salt) * 100),
      message: getSaltMessage(salt),
    });
  }

  return analyses;
}

function getCaloriesMessage(value: number): string {
  if (value <= 40) return 'Very low calorie';
  if (value <= 100) return 'Low calorie';
  if (value <= 200) return 'Moderate calorie';
  if (value <= 400) return 'High calorie';
  return 'Very high calorie';
}

function getFatMessage(value: number): string {
  if (value <= 3) return 'Low in fat';
  if (value <= 17.5) return 'Moderate fat content';
  return 'High in fat';
}

function getSaturatedFatMessage(value: number): string {
  if (value <= 1.5) return 'Low in saturated fat';
  if (value <= 5) return 'Moderate saturated fat';
  return 'High in saturated fat - limit intake';
}

function getSugarMessage(value: number): string {
  if (value <= 5) return 'Low in sugars';
  if (value <= 12.5) return 'Moderate sugar content';
  if (value <= 22.5) return 'High in sugars';
  return 'Very high in sugars - limit intake';
}

function getFiberMessage(value: number): string {
  if (value >= 6) return 'High in fiber - excellent!';
  if (value >= 3) return 'Good source of fiber';
  return 'Low in fiber';
}

function getProteinMessage(value: number): string {
  if (value >= 12) return 'High protein';
  if (value >= 6) return 'Good protein source';
  return 'Low protein';
}

function getSaltMessage(value: number): string {
  if (value <= 0.3) return 'Low in salt';
  if (value <= 1.5) return 'Moderate salt content';
  return 'High in salt - limit intake';
}

export function formatNutrientValue(value: number | undefined, decimals: number = 1): string {
  if (value === undefined || value === null) return '-';
  return value.toFixed(decimals);
}

export function getNutrientRatingColor(rating: 'good' | 'moderate' | 'poor'): string {
  switch (rating) {
    case 'good':
      return '#22c55e'; // Green
    case 'moderate':
      return '#eab308'; // Yellow
    case 'poor':
      return '#ef4444'; // Red
  }
}
