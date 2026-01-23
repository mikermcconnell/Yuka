'use client';

import { AdditiveLoadScore } from '@/types';
import {
  getProcessingLevelInfo,
  getNormalizedLoadScore,
} from '@/lib/scoring/additiveLoad';

interface AdditiveLoadIndicatorProps {
  loadScore: AdditiveLoadScore;
  compact?: boolean;
}

/**
 * AdditiveLoadIndicator (Feature 5)
 *
 * Visual indicator showing the cumulative additive load of a product.
 * Displays a circular progress gauge with color coding by processing level.
 */
export default function AdditiveLoadIndicator({
  loadScore,
  compact = false,
}: AdditiveLoadIndicatorProps) {
  const levelInfo = getProcessingLevelInfo(loadScore.processingLevel);
  const normalizedScore = getNormalizedLoadScore(loadScore);

  // SVG circle parameters
  const size = compact ? 60 : 100;
  const strokeWidth = compact ? 6 : 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  // Get stroke color based on processing level
  const strokeColor = {
    minimal: '#22c55e', // green-500
    low: '#10b981', // emerald-500
    moderate: '#eab308', // yellow-500
    high: '#f97316', // orange-500
    ultra: '#ef4444', // red-500
  }[loadScore.processingLevel];

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="relative" style={{ width: size, height: size }}>
          {/* Background circle */}
          <svg className="transform -rotate-90" width={size} height={size}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={strokeWidth}
            />
            {/* Progress circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-sm font-bold ${levelInfo.color}`}>
              {loadScore.totalCount}
            </span>
          </div>
        </div>
        <div className="text-xs">
          <div className={`font-medium ${levelInfo.color}`}>{levelInfo.label}</div>
          <div className="text-gray-500">{loadScore.totalCount} additives</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 rounded-lg border ${levelInfo.bgColor} ${levelInfo.borderColor}`}
    >
      <div className="flex items-center gap-4">
        {/* Circular gauge */}
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
          {/* Background circle */}
          <svg className="transform -rotate-90" width={size} height={size}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={strokeWidth}
            />
            {/* Progress circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${levelInfo.color}`}>
              {loadScore.totalCount}
            </span>
            <span className="text-xs text-gray-500">additives</span>
          </div>
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold ${levelInfo.color}`}>{levelInfo.label}</h4>
          <p className="text-sm text-gray-600 mt-1">{levelInfo.description}</p>

          {/* Breakdown badges */}
          <div className="flex flex-wrap gap-1 mt-2">
            {loadScore.breakdown.avoidCount > 0 && (
              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">
                {loadScore.breakdown.avoidCount} avoid
              </span>
            )}
            {loadScore.breakdown.moderateCount > 0 && (
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">
                {loadScore.breakdown.moderateCount} moderate
              </span>
            )}
            {loadScore.breakdown.safeCount > 0 && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                {loadScore.breakdown.safeCount} safe
              </span>
            )}
            {loadScore.breakdown.unknownCount > 0 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                {loadScore.breakdown.unknownCount} unknown
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Minimal version showing just the processing level badge.
 */
export function ProcessingLevelBadge({
  loadScore,
}: {
  loadScore: AdditiveLoadScore;
}) {
  const levelInfo = getProcessingLevelInfo(loadScore.processingLevel);

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${levelInfo.bgColor} ${levelInfo.color} border ${levelInfo.borderColor}`}
    >
      <ProcessingLevelIcon level={loadScore.processingLevel} />
      {levelInfo.label}
    </span>
  );
}

/**
 * Icon for processing level.
 */
function ProcessingLevelIcon({
  level,
}: {
  level: AdditiveLoadScore['processingLevel'];
}) {
  switch (level) {
    case 'minimal':
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      );
    case 'low':
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      );
    case 'moderate':
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9a1 1 0 112 0v4a1 1 0 11-2 0V9zm1-4a1 1 0 100 2 1 1 0 000-2z"
            clipRule="evenodd"
          />
        </svg>
      );
    case 'high':
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      );
    case 'ultra':
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      );
  }
}
