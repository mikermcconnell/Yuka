'use client';

import { getNutriScoreColor } from '@/lib/scoring/healthScore';

interface NutriScoreProps {
  grade?: string;
  size?: 'sm' | 'md' | 'lg';
}

const grades = ['A', 'B', 'C', 'D', 'E'] as const;

export default function NutriScore({ grade, size = 'md' }: NutriScoreProps) {
  if (!grade) return null;

  const normalizedGrade = grade.toUpperCase();
  const validGrade = grades.includes(normalizedGrade as typeof grades[number])
    ? normalizedGrade
    : null;

  if (!validGrade) return null;

  const dimensions = {
    sm: { height: 'h-6', width: 'w-6', text: 'text-xs', spacing: 'gap-0.5' },
    md: { height: 'h-8', width: 'w-8', text: 'text-sm', spacing: 'gap-1' },
    lg: { height: 'h-10', width: 'w-10', text: 'text-base', spacing: 'gap-1.5' },
  };

  const dim = dimensions[size];

  return (
    <div className="flex flex-col items-start">
      <span className="text-xs text-gray-500 mb-1">Nutri-Score</span>
      <div className={`flex ${dim.spacing}`}>
        {grades.map((g) => {
          const isActive = g === validGrade;
          const color = getNutriScoreColor(g);

          return (
            <div
              key={g}
              className={`
                ${dim.width} ${dim.height}
                flex items-center justify-center
                rounded font-bold ${dim.text}
                transition-all duration-200
                ${isActive ? 'scale-110 shadow-md' : 'opacity-40'}
              `}
              style={{
                backgroundColor: color,
                color: 'white',
              }}
            >
              {g}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// NOVA processing badge
interface NovaGroupProps {
  group?: number;
  size?: 'sm' | 'md' | 'lg';
}

const novaColors: Record<number, string> = {
  1: '#22c55e', // Green - Unprocessed
  2: '#84cc16', // Light green - Culinary ingredients
  3: '#eab308', // Yellow - Processed
  4: '#ef4444', // Red - Ultra-processed
};

const novaLabels: Record<number, string> = {
  1: 'Unprocessed',
  2: 'Culinary ingredients',
  3: 'Processed',
  4: 'Ultra-processed',
};

export function NovaGroup({ group, size = 'md' }: NovaGroupProps) {
  if (!group || group < 1 || group > 4) return null;

  const dimensions = {
    sm: { circle: 'w-6 h-6', text: 'text-xs', label: 'text-xs' },
    md: { circle: 'w-8 h-8', text: 'text-sm', label: 'text-sm' },
    lg: { circle: 'w-10 h-10', text: 'text-base', label: 'text-base' },
  };

  const dim = dimensions[size];
  const color = novaColors[group];
  const label = novaLabels[group];

  return (
    <div className="flex flex-col items-start">
      <span className="text-xs text-gray-500 mb-1">NOVA Group</span>
      <div className="flex items-center gap-2">
        <div
          className={`${dim.circle} rounded-full flex items-center justify-center font-bold ${dim.text} text-white`}
          style={{ backgroundColor: color }}
        >
          {group}
        </div>
        <span className={`${dim.label} text-gray-700`}>{label}</span>
      </div>
    </div>
  );
}
