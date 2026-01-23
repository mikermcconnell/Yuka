'use client';

import { Nutriments } from '@/types';
import { analyzeNutrients, getNutrientRatingColor } from '@/lib/scoring/nutrientAnalysis';
import { formatNumber } from '@/lib/utils/formatters';

interface NutritionTableProps {
  nutriments: Nutriments;
  servingSize?: string;
  showAnalysis?: boolean;
}

export default function NutritionTable({
  nutriments,
  servingSize,
  showAnalysis = true,
}: NutritionTableProps) {
  const analyses = showAnalysis ? analyzeNutrients(nutriments) : [];

  const nutritionData = [
    {
      label: 'Energy',
      value: nutriments['energy-kcal_100g'] || (nutriments.energy_100g ? nutriments.energy_100g / 4.184 : undefined),
      unit: 'kcal',
      perServing: nutriments['energy-kcal_serving'],
    },
    {
      label: 'Fat',
      value: nutriments.fat_100g,
      unit: 'g',
      perServing: nutriments.fat_serving,
    },
    {
      label: '  of which saturates',
      value: nutriments['saturated-fat_100g'],
      unit: 'g',
      perServing: nutriments['saturated-fat_serving'],
      indent: true,
    },
    {
      label: 'Carbohydrate',
      value: nutriments.carbohydrates_100g,
      unit: 'g',
      perServing: nutriments.carbohydrates_serving,
    },
    {
      label: '  of which sugars',
      value: nutriments.sugars_100g,
      unit: 'g',
      perServing: nutriments.sugars_serving,
      indent: true,
    },
    {
      label: 'Fibre',
      value: nutriments.fiber_100g,
      unit: 'g',
      perServing: nutriments.fiber_serving,
    },
    {
      label: 'Protein',
      value: nutriments.proteins_100g,
      unit: 'g',
      perServing: nutriments.proteins_serving,
    },
    {
      label: 'Salt',
      value: nutriments.salt_100g,
      unit: 'g',
      perServing: nutriments.salt_serving,
    },
  ];

  const getAnalysisForNutrient = (label: string) => {
    const normalizedLabel = label.trim().toLowerCase();
    return analyses.find((a) => a.nutrient.toLowerCase() === normalizedLabel);
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Nutrition Facts</h3>
      <p className="text-sm text-gray-500 mb-4">Per 100g{servingSize ? ` / Serving: ${servingSize}` : ''}</p>

      <div className="bg-gray-50 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left py-2 px-3 font-medium text-gray-700">Nutrient</th>
              <th className="text-right py-2 px-3 font-medium text-gray-700">Per 100g</th>
              {servingSize && (
                <th className="text-right py-2 px-3 font-medium text-gray-700">Per serving</th>
              )}
              {showAnalysis && (
                <th className="text-center py-2 px-3 font-medium text-gray-700 w-20">Rating</th>
              )}
            </tr>
          </thead>
          <tbody>
            {nutritionData.map((row, index) => {
              const analysis = getAnalysisForNutrient(row.label);

              return (
                <tr
                  key={row.label}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className={`py-2 px-3 ${row.indent ? 'text-gray-600' : 'font-medium text-gray-900'}`}>
                    {row.label}
                  </td>
                  <td className="text-right py-2 px-3 text-gray-700">
                    {row.value !== undefined ? `${formatNumber(row.value)} ${row.unit}` : '-'}
                  </td>
                  {servingSize && (
                    <td className="text-right py-2 px-3 text-gray-600">
                      {row.perServing !== undefined ? `${formatNumber(row.perServing)} ${row.unit}` : '-'}
                    </td>
                  )}
                  {showAnalysis && (
                    <td className="text-center py-2 px-3">
                      {analysis && (
                        <span
                          className="inline-block w-3 h-3 rounded-full"
                          style={{ backgroundColor: getNutrientRatingColor(analysis.rating) }}
                          title={analysis.message}
                        />
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Analysis Summary */}
      {showAnalysis && analyses.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Analysis</h4>
          <div className="grid gap-2">
            {analyses.map((analysis) => (
              <div
                key={analysis.nutrient}
                className="flex items-center gap-2 text-sm"
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: getNutrientRatingColor(analysis.rating) }}
                />
                <span className="text-gray-600">{analysis.message}</span>
                {analysis.percentDV !== undefined && (
                  <span className="text-gray-400 ml-auto">
                    {analysis.percentDV}% DV
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
