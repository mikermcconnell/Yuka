'use client';

import { useMemo } from 'react';
import { getScoreColor, getScoreLabel } from '@/lib/scoring/healthScore';

interface ScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function ScoreGauge({
  score,
  size = 'md',
  showLabel = true,
}: ScoreGaugeProps) {
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  const dimensions = useMemo(() => {
    switch (size) {
      case 'sm':
        return { size: 60, stroke: 6, fontSize: 'text-sm', labelSize: 'text-xs' };
      case 'lg':
        return { size: 120, stroke: 10, fontSize: 'text-3xl', labelSize: 'text-base' };
      default:
        return { size: 80, stroke: 8, fontSize: 'text-xl', labelSize: 'text-sm' };
    }
  }, [size]);

  const radius = (dimensions.size - dimensions.stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: dimensions.size, height: dimensions.size }}>
        {/* Background circle */}
        <svg
          className="transform -rotate-90"
          width={dimensions.size}
          height={dimensions.size}
        >
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={dimensions.stroke}
          />
          {/* Progress circle */}
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={dimensions.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${dimensions.fontSize}`} style={{ color }}>
            {score}
          </span>
        </div>
      </div>

      {showLabel && (
        <span
          className={`mt-1 font-medium ${dimensions.labelSize}`}
          style={{ color }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

// Linear score bar variant
interface ScoreBarProps {
  score: number;
  showLabel?: boolean;
  height?: number;
}

export function ScoreBar({ score, showLabel = true, height = 8 }: ScoreBarProps) {
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Health Score</span>
          <span className="text-sm font-bold" style={{ color }}>
            {score}/100 - {label}
          </span>
        </div>
      )}
      <div
        className="w-full bg-gray-200 rounded-full overflow-hidden"
        style={{ height }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${score}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
