'use client';

import { useState } from 'react';
import { InteractionWarning, WarningSeverity } from '@/types';
import {
  detectInteractions,
  getInteractionColors,
  getInteractionSummary,
} from '@/lib/scoring/additiveInteractions';
import { getAdditive } from '@/lib/scoring/additives';
import { Modal } from '@/components/ui';

interface InteractionWarningsProps {
  additives: string[];
}

/**
 * InteractionWarnings (Feature 4)
 *
 * Displays warnings when combinations of additives may create additional risks.
 */
export default function InteractionWarnings({ additives }: InteractionWarningsProps) {
  const [selectedWarning, setSelectedWarning] = useState<InteractionWarning | null>(
    null
  );

  const interactions = detectInteractions(additives);

  if (interactions.length === 0) {
    return null;
  }

  const summary = getInteractionSummary(additives);

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
        <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
        Additive Interactions
      </h4>

      <div className="space-y-2">
        {interactions.map((interaction, index) => (
          <InteractionCard
            key={`${interaction.id}-${index}`}
            interaction={interaction}
            onClick={() => setSelectedWarning(interaction)}
          />
        ))}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={selectedWarning !== null}
        onClose={() => setSelectedWarning(null)}
        title="Interaction Details"
      >
        {selectedWarning && <InteractionDetailView interaction={selectedWarning} />}
      </Modal>
    </div>
  );
}

/**
 * Card showing a single interaction warning.
 */
function InteractionCard({
  interaction,
  onClick,
}: {
  interaction: InteractionWarning;
  onClick: () => void;
}) {
  const colors = getInteractionColors(interaction.severity);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-lg border ${colors.border} ${colors.bg} p-3 transition-all hover:shadow-md`}
    >
      <div className="flex items-start gap-3">
        <InteractionIcon severity={interaction.severity} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-medium ${colors.text}`}>
              {interaction.title}
            </span>
            <InteractionTypeBadge type={interaction.type} />
          </div>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {interaction.description}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {interaction.detectedAdditives.map((code) => (
              <span
                key={code}
                className="px-1.5 py-0.5 bg-white/50 rounded text-xs font-medium text-gray-700"
              >
                {code}
              </span>
            ))}
          </div>
        </div>
        <svg
          className="w-5 h-5 text-gray-400 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </button>
  );
}

/**
 * Detailed view of an interaction.
 */
function InteractionDetailView({ interaction }: { interaction: InteractionWarning }) {
  const colors = getInteractionColors(interaction.severity);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className={`p-4 rounded-lg ${colors.bg} border ${colors.border}`}>
        <div className="flex items-start gap-3">
          <InteractionIcon severity={interaction.severity} size="lg" />
          <div>
            <h3 className={`text-lg font-semibold ${colors.text}`}>
              {interaction.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <InteractionTypeBadge type={interaction.type} />
              <SeverityBadge severity={interaction.severity} />
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">What happens?</h4>
        <p className="text-sm text-gray-600">{interaction.description}</p>
      </div>

      {/* Resulting compound */}
      {interaction.resultingCompound && (
        <div className="bg-gray-50 rounded-lg p-3">
          <span className="text-sm font-medium text-gray-700">May form: </span>
          <span className="text-sm text-red-600 font-medium">
            {interaction.resultingCompound}
          </span>
        </div>
      )}

      {/* Involved additives */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">
          Additives Involved
        </h4>
        <div className="space-y-2">
          {interaction.detectedAdditives.map((code) => {
            const additive = getAdditive(code);
            return (
              <div
                key={code}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
              >
                <span className="font-bold text-gray-700">{code}</span>
                {additive && (
                  <span className="text-sm text-gray-600">{additive.name}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Scientific basis */}
      {interaction.scientificBasis && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Scientific Basis
          </h4>
          <p className="text-sm text-gray-600 italic">
            {interaction.scientificBasis}
          </p>
        </div>
      )}

      {/* Educational note */}
      <p className="text-xs text-gray-500">
        Interaction risks depend on amounts consumed and individual factors.
        Occasional exposure is typically less concerning than regular consumption.
      </p>
    </div>
  );
}

/**
 * Icon based on severity.
 */
function InteractionIcon({
  severity,
  size = 'sm',
}: {
  severity: WarningSeverity;
  size?: 'sm' | 'lg';
}) {
  const colors = getInteractionColors(severity);
  const sizeClass = size === 'lg' ? 'w-8 h-8' : 'w-5 h-5';

  if (severity === 'critical' || severity === 'warning') {
    return (
      <svg
        className={`${sizeClass} ${colors.icon} flex-shrink-0`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  return (
    <svg
      className={`${sizeClass} ${colors.icon} flex-shrink-0`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/**
 * Badge showing interaction type.
 */
function InteractionTypeBadge({ type }: { type: InteractionWarning['type'] }) {
  const labels = {
    formation: 'Forms Compound',
    amplification: 'Amplified Effect',
    synergy: 'Synergy',
  };

  const colors = {
    formation: 'bg-purple-100 text-purple-700',
    amplification: 'bg-blue-100 text-blue-700',
    synergy: 'bg-indigo-100 text-indigo-700',
  };

  return (
    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${colors[type]}`}>
      {labels[type]}
    </span>
  );
}

/**
 * Badge showing severity level.
 */
function SeverityBadge({ severity }: { severity: WarningSeverity }) {
  const colors = {
    critical: 'bg-red-100 text-red-700',
    warning: 'bg-orange-100 text-orange-700',
    caution: 'bg-yellow-100 text-yellow-700',
    info: 'bg-blue-100 text-blue-700',
  };

  const labels = {
    critical: 'Critical',
    warning: 'Warning',
    caution: 'Caution',
    info: 'Info',
  };

  return (
    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${colors[severity]}`}>
      {labels[severity]}
    </span>
  );
}

/**
 * Compact summary badge for interaction warnings.
 */
export function InteractionSummaryBadge({ additives }: { additives: string[] }) {
  const summary = getInteractionSummary(additives);

  if (summary.warningCount === 0 && summary.cautionCount === 0) {
    return null;
  }

  const colors = getInteractionColors(summary.highestSeverity || 'caution');

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}
    >
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
      </svg>
      {summary.warningCount + summary.cautionCount} interaction
      {summary.warningCount + summary.cautionCount > 1 ? 's' : ''}
    </span>
  );
}
