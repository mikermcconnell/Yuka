'use client';

import { useState } from 'react';
import { ContextualExplanation } from '@/types';

interface ContextualExplanationsProps {
  explanations: ContextualExplanation[];
}

const severityConfig: Record<ContextualExplanation['severity'], {
  bg: string;
  border: string;
  text: string;
  barColor: string;
  label: string;
}> = {
  good: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    barColor: 'bg-green-500',
    label: 'Excellent',
  },
  moderate: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    barColor: 'bg-yellow-500',
    label: 'Moderate',
  },
  high: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    barColor: 'bg-orange-500',
    label: 'High',
  },
  critical: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    barColor: 'bg-red-500',
    label: 'Critical',
  },
};

export default function ContextualExplanations({ explanations }: ContextualExplanationsProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (explanations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        Personalized Nutrient Analysis
      </h3>

      <div className="space-y-2">
        {explanations.map((explanation) => {
          const config = severityConfig[explanation.severity];
          const isExpanded = expanded === explanation.nutrient;
          const percentOfThreshold = Math.min(
            (explanation.value / explanation.personalizedThreshold) * 100,
            150
          );

          return (
            <button
              key={explanation.nutrient}
              onClick={() => setExpanded(isExpanded ? null : explanation.nutrient)}
              className={`w-full text-left rounded-lg border ${config.border} ${config.bg} overflow-hidden transition-all`}
            >
              {/* Main row */}
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">{explanation.nutrient}</span>
                    {explanation.isPersonalized && (
                      <span className="px-1.5 py-0.5 text-[10px] font-medium bg-purple-100 text-purple-700 rounded">
                        PERSONALIZED
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${config.text}`}>
                      {explanation.value.toFixed(1)}{explanation.unit}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}>
                      {config.label}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="relative">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${config.barColor}`}
                      style={{ width: `${Math.min(percentOfThreshold, 100)}%` }}
                    />
                  </div>
                  {/* Threshold marker */}
                  <div
                    className="absolute top-0 w-0.5 h-2 bg-gray-600"
                    style={{ left: `${(100 / 1.5)}%` }}
                    title="Your threshold"
                  />
                </div>

                {/* Threshold labels */}
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>0</span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-0.5 bg-gray-600 inline-block" />
                    Your limit: {explanation.personalizedThreshold}{explanation.unit}
                  </span>
                </div>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-3 pb-3 pt-0 space-y-3 border-t border-gray-100 mt-2">
                  {/* Explanation */}
                  <div className="p-3 bg-white rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-700 leading-relaxed">{explanation.explanation}</p>
                  </div>

                  {/* Threshold comparison */}
                  {explanation.standardThreshold !== explanation.personalizedThreshold && (
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex-1">
                        <span className="text-gray-500">Standard threshold:</span>
                        <span className="ml-1 font-medium text-gray-700">
                          {explanation.standardThreshold}{explanation.unit}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-purple-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Your threshold:</span>
                        <span className="font-bold">{explanation.personalizedThreshold}{explanation.unit}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        Thresholds adjusted based on your genetic profile. Tap for details.
      </p>
    </div>
  );
}

// Inline version for nutrition table
export function InlineContextualNote({ explanation }: { explanation: ContextualExplanation }) {
  const config = severityConfig[explanation.severity];

  return (
    <div className={`mt-1 px-2 py-1 rounded text-xs ${config.bg} ${config.text}`}>
      <span className="font-medium">Personalized:</span> {explanation.explanation.split('.')[0]}.
    </div>
  );
}
