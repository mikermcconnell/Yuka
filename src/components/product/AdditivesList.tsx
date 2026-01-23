'use client';

import { useState } from 'react';
import { Additive, AdditiveRisk, AdditiveExplanation, AdditiveFunction } from '@/types';
import { analyzeAdditives } from '@/lib/scoring/additives';
import { getAdditiveExplanation } from '@/lib/scoring/additiveExplanations';
import { calculateAdditiveLoad } from '@/lib/scoring/additiveLoad';
import {
  groupAdditivesByFunction,
  getAdditiveFunctions,
  ADDITIVE_FUNCTION_INFO,
} from '@/lib/scoring/additiveFunctions';
import { isBannedAnywhere, requiresWarningAnywhere } from '@/lib/scoring/regulatoryStatus';
import { detectInteractions } from '@/lib/scoring/additiveInteractions';
import { Modal } from '@/components/ui';
import AdditiveLoadIndicator from './AdditiveLoadIndicator';
import RegulatoryAlerts from './RegulatoryAlerts';
import InteractionWarnings from './InteractionWarnings';

type ViewMode = 'risk' | 'function';

interface AdditivesListProps {
  additives: string[];
  showLoadIndicator?: boolean;
  showRegulatoryAlerts?: boolean;
  showInteractionWarnings?: boolean;
}

export default function AdditivesList({
  additives,
  showLoadIndicator = true,
  showRegulatoryAlerts = true,
  showInteractionWarnings = true,
}: AdditivesListProps) {
  const [selectedAdditive, setSelectedAdditive] = useState<{
    additive: Additive;
    explanation: AdditiveExplanation | null;
  } | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('risk');

  const additiveAnalysis = analyzeAdditives(additives);
  const additiveLoad = calculateAdditiveLoad(additives);
  const groupedByFunction = groupAdditivesByFunction(additives);
  const interactions = detectInteractions(additives);

  const riskColors: Record<AdditiveRisk, { bg: string; text: string; border: string; badge: string }> = {
    safe: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', badge: 'bg-green-100' },
    moderate: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', badge: 'bg-yellow-100' },
    avoid: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', badge: 'bg-red-100' },
  };

  const riskLabels: Record<AdditiveRisk, string> = {
    safe: 'Safe',
    moderate: 'Moderate Risk',
    avoid: 'Avoid',
  };

  const riskIcons: Record<AdditiveRisk, React.ReactNode> = {
    safe: (
      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    moderate: (
      <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    avoid: (
      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
  };

  const handleAdditiveClick = (additive: Additive) => {
    const explanation = getAdditiveExplanation(additive.code);
    setSelectedAdditive({ additive, explanation });
  };

  if (additives.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-4">
      {/* Header with view toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Additives</h3>
        <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {/* Additive Load Indicator */}
      {showLoadIndicator && (
        <AdditiveLoadIndicator loadScore={additiveLoad} />
      )}

      {/* Regulatory Alerts */}
      {showRegulatoryAlerts && (
        <RegulatoryAlerts additives={additives} />
      )}

      {/* Interaction Warnings */}
      {showInteractionWarnings && interactions.length > 0 && (
        <InteractionWarnings additives={additives} />
      )}

      {/* Summary badges */}
      <div className="flex flex-wrap gap-2">
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

      {/* Additive list - by risk or by function */}
      {viewMode === 'risk' ? (
        <RiskBasedList
          analysis={additiveAnalysis}
          riskColors={riskColors}
          onAdditiveClick={handleAdditiveClick}
        />
      ) : (
        <FunctionBasedList
          groups={groupedByFunction}
          riskColors={riskColors}
          onAdditiveClick={handleAdditiveClick}
        />
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={selectedAdditive !== null}
        onClose={() => setSelectedAdditive(null)}
        title={selectedAdditive?.additive.name || ''}
      >
        {selectedAdditive && (
          <AdditiveDetailView
            additive={selectedAdditive.additive}
            explanation={selectedAdditive.explanation}
            riskColors={riskColors}
            riskLabels={riskLabels}
            riskIcons={riskIcons}
          />
        )}
      </Modal>
    </div>
  );
}

/**
 * Toggle between risk-based and function-based views.
 */
function ViewToggle({
  viewMode,
  onViewModeChange,
}: {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}) {
  return (
    <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
      <button
        onClick={() => onViewModeChange('risk')}
        className={`px-3 py-1.5 ${
          viewMode === 'risk'
            ? 'bg-gray-100 text-gray-900 font-medium'
            : 'bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        By Risk
      </button>
      <button
        onClick={() => onViewModeChange('function')}
        className={`px-3 py-1.5 border-l border-gray-200 ${
          viewMode === 'function'
            ? 'bg-gray-100 text-gray-900 font-medium'
            : 'bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        By Function
      </button>
    </div>
  );
}

/**
 * Risk-based list (original view).
 */
function RiskBasedList({
  analysis,
  riskColors,
  onAdditiveClick,
}: {
  analysis: ReturnType<typeof analyzeAdditives>;
  riskColors: Record<AdditiveRisk, { bg: string; text: string; border: string; badge: string }>;
  onAdditiveClick: (additive: Additive) => void;
}) {
  return (
    <div className="space-y-2">
      {/* Avoid first */}
      {analysis.avoid.map((additive) => (
        <AdditiveItem
          key={additive.code}
          additive={additive}
          colors={riskColors.avoid}
          onClick={() => onAdditiveClick(additive)}
        />
      ))}
      {/* Then moderate */}
      {analysis.moderate.map((additive) => (
        <AdditiveItem
          key={additive.code}
          additive={additive}
          colors={riskColors.moderate}
          onClick={() => onAdditiveClick(additive)}
        />
      ))}
      {/* Then safe */}
      {analysis.safe.map((additive) => (
        <AdditiveItem
          key={additive.code}
          additive={additive}
          colors={riskColors.safe}
          onClick={() => onAdditiveClick(additive)}
        />
      ))}
      {/* Unknown additives */}
      {analysis.unknown.map((code) => (
        <div
          key={code}
          className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
        >
          <span className="font-medium text-gray-700">{code}</span>
          <span className="text-sm text-gray-500">Unknown additive</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Function-based grouped list (new view).
 */
function FunctionBasedList({
  groups,
  riskColors,
  onAdditiveClick,
}: {
  groups: ReturnType<typeof groupAdditivesByFunction>;
  riskColors: Record<AdditiveRisk, { bg: string; text: string; border: string; badge: string }>;
  onAdditiveClick: (additive: Additive) => void;
}) {
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.function} className="space-y-2">
          {/* Function header */}
          <div className="flex items-center gap-2">
            <FunctionIcon func={group.function} />
            <h4 className="text-sm font-semibold text-gray-700">
              {group.info.label}
            </h4>
            <span className="text-xs text-gray-400">
              {group.additives.length}
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-2">{group.info.description}</p>

          {/* Additives in this group */}
          <div className="space-y-1">
            {group.additives.map((additive) => (
              <AdditiveItem
                key={additive.code}
                additive={additive}
                colors={riskColors[additive.risk]}
                onClick={() => onAdditiveClick(additive)}
                compact
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Icon for additive function category.
 */
function FunctionIcon({ func }: { func: AdditiveFunction }) {
  const icons: Partial<Record<AdditiveFunction, React.ReactNode>> = {
    preservative: (
      <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
      </svg>
    ),
    coloring: (
      <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
      </svg>
    ),
    sweetener: (
      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
      </svg>
    ),
    flavor_enhancer: (
      <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
    emulsifier: (
      <svg className="w-4 h-4 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
      </svg>
    ),
    thickener: (
      <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1zm-1 7a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3zm2 2v-1h1v1h-1z" clipRule="evenodd" />
      </svg>
    ),
    antioxidant: (
      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    acidity_regulator: (
      <svg className="w-4 h-4 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
      </svg>
    ),
  };

  return icons[func] || (
    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  );
}

interface AdditiveItemProps {
  additive: Additive;
  colors: { bg: string; text: string; border: string };
  onClick: () => void;
  compact?: boolean;
}

function AdditiveItem({ additive, colors, onClick, compact = false }: AdditiveItemProps) {
  const hasDetailedExplanation = getAdditiveExplanation(additive.code) !== null;
  const hasBan = isBannedAnywhere(additive.code);
  const hasWarning = requiresWarningAnywhere(additive.code);

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`w-full rounded border ${colors.border} ${colors.bg} px-2 py-1.5 text-left transition-all hover:shadow-sm flex items-center justify-between`}
      >
        <div className="flex items-center gap-2">
          <span className={`font-bold text-sm ${colors.text}`}>{additive.code}</span>
          <span className="text-gray-600 text-sm">{additive.name}</span>
          {hasBan && <span className="text-xs">🚫</span>}
          {hasWarning && !hasBan && <span className="text-xs">⚠️</span>}
        </div>
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg border ${colors.border} ${colors.bg} overflow-hidden text-left transition-all hover:shadow-md active:scale-[0.99]`}
    >
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <span className={`font-bold ${colors.text}`}>{additive.code}</span>
          <span className="text-gray-700">{additive.name}</span>
          {hasBan && <span className="text-xs" title="Banned in some countries">🚫</span>}
          {hasWarning && !hasBan && <span className="text-xs" title="Warning required in some countries">⚠️</span>}
        </div>
        <div className="flex items-center gap-2">
          {hasDetailedExplanation && (
            <span className="text-xs text-gray-400">Tap for details</span>
          )}
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
}

interface AdditiveDetailViewProps {
  additive: Additive;
  explanation: AdditiveExplanation | null;
  riskColors: Record<AdditiveRisk, { bg: string; text: string; border: string; badge: string }>;
  riskLabels: Record<AdditiveRisk, string>;
  riskIcons: Record<AdditiveRisk, React.ReactNode>;
}

function AdditiveDetailView({
  additive,
  explanation,
  riskColors,
  riskLabels,
  riskIcons,
}: AdditiveDetailViewProps) {
  const colors = riskColors[additive.risk];
  const functions = getAdditiveFunctions(additive.code);

  return (
    <div className="space-y-4">
      {/* Header with code and risk badge */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-xl font-bold ${colors.text}`}>{additive.code}</span>
            {explanation?.commonName && (
              <span className="text-gray-500">({explanation.commonName})</span>
            )}
          </div>
          {/* Function tags */}
          <div className="flex flex-wrap gap-1 mt-1">
            {functions.map((func) => (
              <span
                key={func}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {ADDITIVE_FUNCTION_INFO[func]?.label || func}
              </span>
            ))}
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${colors.badge} ${colors.text}`}>
          {riskIcons[additive.risk]}
          <span className="font-medium text-sm">{riskLabels[additive.risk]}</span>
        </div>
      </div>

      {explanation ? (
        <>
          {/* What it does */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">What it does</h4>
            <p className="text-gray-600 text-sm">{explanation.function}</p>
          </div>

          {/* Why this rating - the key explanation */}
          <div className={`p-4 rounded-lg ${colors.bg} border ${colors.border}`}>
            <h4 className={`text-sm font-semibold ${colors.text} mb-2`}>Why this rating?</h4>
            <p className="text-gray-700 text-sm leading-relaxed">{explanation.whyThisRating}</p>
          </div>

          {/* Found in */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Commonly found in</h4>
            <div className="flex flex-wrap gap-2">
              {explanation.foundIn.map((food, i) => (
                <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {food}
                </span>
              ))}
            </div>
          </div>

          {/* Notes if any */}
          {explanation.notes && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-blue-800 text-sm">
                <span className="font-medium">Note:</span> {explanation.notes}
              </p>
            </div>
          )}

          {/* Sources */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Sources</h4>
            <ul className="space-y-1">
              {explanation.sources.map((source, i) => (
                <li key={i} className="text-sm">
                  {source.url ? (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {source.name}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <span className="text-gray-600">{source.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        /* Fallback for additives without detailed explanation */
        <>
          {additive.description && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Description</h4>
              <p className="text-gray-600 text-sm">{additive.description}</p>
            </div>
          )}

          {additive.concerns && additive.concerns.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Concerns</h4>
              <ul className="space-y-1">
                {additive.concerns.map((concern, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className={colors.text}>•</span>
                    {concern}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-sm">
              Detailed explanation not yet available for this additive.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
