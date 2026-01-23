'use client';

import { useState } from 'react';
import { RegulatoryJurisdiction, RegulatoryStatus } from '@/types';
import {
  getAdditiveRegulatory,
  isBannedAnywhere,
  requiresWarningAnywhere,
  compareRegulations,
  JURISDICTION_NAMES,
  JURISDICTION_FLAGS,
  STATUS_INFO,
} from '@/lib/scoring/regulatoryStatus';
import { getAdditive } from '@/lib/scoring/additives';
import { Modal } from '@/components/ui';

interface RegulatoryAlertsProps {
  additives: string[];
}

/**
 * RegulatoryAlerts (Feature 3)
 *
 * Shows which additives in a product are banned or restricted in various countries.
 * Provides educational context about global regulatory differences.
 */
export default function RegulatoryAlerts({ additives }: RegulatoryAlertsProps) {
  const [selectedAdditive, setSelectedAdditive] = useState<string | null>(null);

  // Find additives with notable regulatory status
  const alertAdditives = additives.filter(
    (code) => isBannedAnywhere(code) || requiresWarningAnywhere(code)
  );

  if (alertAdditives.length === 0) {
    return null;
  }

  // Group by type of alert
  const bannedAdditives = alertAdditives.filter((code) => isBannedAnywhere(code));
  const warningAdditives = alertAdditives.filter(
    (code) => !isBannedAnywhere(code) && requiresWarningAnywhere(code)
  );

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
        <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        Regulatory Status
      </h4>

      {/* Banned additives */}
      {bannedAdditives.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-800">
                Banned in Some Countries
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {bannedAdditives.map((code) => (
                  <RegulatoryAdditiveButton
                    key={code}
                    code={code}
                    type="banned"
                    onClick={() => setSelectedAdditive(code)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warning required additives */}
      {warningAdditives.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-orange-800">
                Warning Labels Required
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {warningAdditives.map((code) => (
                  <RegulatoryAdditiveButton
                    key={code}
                    code={code}
                    type="warning"
                    onClick={() => setSelectedAdditive(code)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={selectedAdditive !== null}
        onClose={() => setSelectedAdditive(null)}
        title="Regulatory Comparison"
      >
        {selectedAdditive && (
          <RegulatoryDetailView code={selectedAdditive} />
        )}
      </Modal>
    </div>
  );
}

/**
 * Button showing an additive with regulatory alert.
 */
function RegulatoryAdditiveButton({
  code,
  type,
  onClick,
}: {
  code: string;
  type: 'banned' | 'warning';
  onClick: () => void;
}) {
  const additive = getAdditive(code);
  const regulatory = getAdditiveRegulatory(code);
  const bgColor = type === 'banned' ? 'bg-red-100' : 'bg-orange-100';
  const textColor = type === 'banned' ? 'text-red-700' : 'text-orange-700';

  // Get flags of countries where it's banned/restricted
  const flags =
    type === 'banned'
      ? regulatory?.bannedIn.map((j) => JURISDICTION_FLAGS[j]).slice(0, 3).join(' ')
      : '';

  return (
    <button
      onClick={onClick}
      className={`${bgColor} ${textColor} px-2 py-1 rounded text-sm flex items-center gap-1 hover:opacity-80 transition-opacity`}
    >
      <span className="font-medium">{code}</span>
      {additive && <span className="text-xs opacity-75">{additive.name}</span>}
      {flags && <span className="ml-1">{flags}</span>}
    </button>
  );
}

/**
 * Detailed view showing regulatory status across jurisdictions.
 */
function RegulatoryDetailView({ code }: { code: string }) {
  const additive = getAdditive(code);
  const comparison = compareRegulations(code);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">{code}</span>
          {additive && <span className="text-gray-500">{additive.name}</span>}
        </div>
        {additive?.description && (
          <p className="text-sm text-gray-600 mt-1">{additive.description}</p>
        )}
      </div>

      {/* Comparison table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-700">
                Jurisdiction
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {comparison.map((item) => (
              <tr key={item.jurisdiction}>
                <td className="px-3 py-2">
                  <span className="flex items-center gap-2">
                    <span>{item.flag}</span>
                    <span className="text-gray-900">{item.name}</span>
                  </span>
                </td>
                <td className="px-3 py-2">
                  <RegulatoryStatusBadge
                    status={item.status}
                    notes={item.notes}
                    warningText={item.warningText}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Warning text if present */}
      {comparison.some((c) => c.warningText) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm font-medium text-yellow-800 mb-2">
            Required Warning Labels
          </p>
          {comparison
            .filter((c) => c.warningText)
            .map((c) => (
              <div key={c.jurisdiction} className="text-sm text-yellow-700 mt-1">
                <span className="font-medium">
                  {c.flag} {c.name}:
                </span>{' '}
                &ldquo;{c.warningText}&rdquo;
              </div>
            ))}
        </div>
      )}

      {/* Educational note */}
      <p className="text-xs text-gray-500">
        Different countries have different regulatory standards based on their assessment
        of scientific evidence. An additive being banned in one country does not
        automatically mean it is unsafe at typical consumption levels.
      </p>
    </div>
  );
}

/**
 * Badge showing regulatory status.
 */
function RegulatoryStatusBadge({
  status,
  notes,
  warningText,
}: {
  status: RegulatoryStatus | 'unknown';
  notes?: string;
  warningText?: string;
}) {
  if (status === 'unknown') {
    return <span className="text-gray-400 text-xs">No data</span>;
  }

  const info = STATUS_INFO[status];

  return (
    <div className="flex flex-col gap-0.5">
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${info.bgColor} ${info.color}`}
      >
        {info.label}
      </span>
      {notes && <span className="text-xs text-gray-500">{notes}</span>}
    </div>
  );
}

/**
 * Compact inline badge for regulatory alerts.
 */
export function RegulatoryAlertBadge({ additives }: { additives: string[] }) {
  const bannedCount = additives.filter((code) => isBannedAnywhere(code)).length;
  const warningCount = additives.filter(
    (code) => !isBannedAnywhere(code) && requiresWarningAnywhere(code)
  ).length;

  if (bannedCount === 0 && warningCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1">
      {bannedCount > 0 && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {bannedCount} banned somewhere
        </span>
      )}
      {warningCount > 0 && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
            />
          </svg>
          {warningCount} warning req&apos;d
        </span>
      )}
    </div>
  );
}
