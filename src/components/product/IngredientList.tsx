'use client';

import { useState } from 'react';
import { Additive, AdditiveRisk } from '@/types';
import { analyzeAdditives } from '@/lib/scoring/additives';

interface IngredientListProps {
  ingredients?: string;
  additives: string[];
  allergens: string[];
}

export default function IngredientList({
  ingredients,
  additives,
  allergens,
}: IngredientListProps) {
  const [expandedAdditive, setExpandedAdditive] = useState<string | null>(null);
  const additiveAnalysis = analyzeAdditives(additives);

  const riskColors: Record<AdditiveRisk, { bg: string; text: string; border: string }> = {
    safe: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    moderate: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    avoid: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  };

  const toggleAdditive = (code: string) => {
    setExpandedAdditive(expandedAdditive === code ? null : code);
  };

  return (
    <div className="w-full space-y-6">
      {/* Allergens Warning */}
      {allergens.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <h4 className="font-medium text-orange-800">Allergen Warning</h4>
              <p className="text-sm text-orange-700 mt-1">
                Contains: {allergens.join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Additives Analysis */}
      {additives.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Additives</h3>

          {/* Summary badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {additiveAnalysis.avoid.length > 0 && (
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                {additiveAnalysis.avoid.length} to avoid
              </span>
            )}
            {additiveAnalysis.moderate.length > 0 && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                {additiveAnalysis.moderate.length} moderate risk
              </span>
            )}
            {additiveAnalysis.safe.length > 0 && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                {additiveAnalysis.safe.length} safe
              </span>
            )}
            {additiveAnalysis.unknown.length > 0 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {additiveAnalysis.unknown.length} unknown
              </span>
            )}
          </div>

          {/* Additive list */}
          <div className="space-y-2">
            {/* Avoid first */}
            {additiveAnalysis.avoid.map((additive) => (
              <AdditiveItem
                key={additive.code}
                additive={additive}
                colors={riskColors.avoid}
                expanded={expandedAdditive === additive.code}
                onToggle={() => toggleAdditive(additive.code)}
              />
            ))}
            {/* Then moderate */}
            {additiveAnalysis.moderate.map((additive) => (
              <AdditiveItem
                key={additive.code}
                additive={additive}
                colors={riskColors.moderate}
                expanded={expandedAdditive === additive.code}
                onToggle={() => toggleAdditive(additive.code)}
              />
            ))}
            {/* Then safe */}
            {additiveAnalysis.safe.map((additive) => (
              <AdditiveItem
                key={additive.code}
                additive={additive}
                colors={riskColors.safe}
                expanded={expandedAdditive === additive.code}
                onToggle={() => toggleAdditive(additive.code)}
              />
            ))}
            {/* Unknown additives */}
            {additiveAnalysis.unknown.map((code) => (
              <div
                key={code}
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <span className="font-medium text-gray-700">{code}</span>
                <span className="text-sm text-gray-500">Unknown additive</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ingredients Text */}
      {ingredients && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Ingredients</h3>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
            {ingredients}
          </p>
        </div>
      )}

      {/* No ingredients available */}
      {!ingredients && additives.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <svg
            className="w-12 h-12 mx-auto mb-3 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p>No ingredient information available</p>
        </div>
      )}
    </div>
  );
}

interface AdditiveItemProps {
  additive: Additive;
  colors: { bg: string; text: string; border: string };
  expanded: boolean;
  onToggle: () => void;
}

function AdditiveItem({ additive, colors, expanded, onToggle }: AdditiveItemProps) {
  return (
    <div
      className={`rounded-lg border ${colors.border} ${colors.bg} overflow-hidden`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 text-left"
      >
        <div className="flex items-center gap-3">
          <span className={`font-bold ${colors.text}`}>{additive.code}</span>
          <span className="text-gray-700">{additive.name}</span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="px-3 pb-3 pt-0 border-t border-gray-100">
          {additive.description && (
            <p className="text-sm text-gray-600 mb-2">{additive.description}</p>
          )}
          {additive.concerns && additive.concerns.length > 0 && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">Concerns:</p>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {additive.concerns.map((concern, i) => (
                  <li key={i}>{concern}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

