'use client';

import { formatWeekRange } from '@/lib/beers/calculations';

interface WeekNavigationProps {
  startDate: Date;
  endDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  isCurrentWeek: boolean;
}

export default function WeekNavigation({
  startDate,
  endDate,
  onPrevious,
  onNext,
  onToday,
  isCurrentWeek,
}: WeekNavigationProps) {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onPrevious}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Previous week"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <div className="text-center">
        <div className="font-semibold text-gray-900">
          {formatWeekRange(startDate, endDate)}
        </div>
        {!isCurrentWeek && (
          <button
            onClick={onToday}
            className="text-xs text-blue-600 hover:text-blue-700 mt-1"
          >
            Go to this week
          </button>
        )}
      </div>

      <button
        onClick={onNext}
        disabled={isCurrentWeek}
        className={`p-2 rounded-lg transition-colors ${
          isCurrentWeek
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        }`}
        aria-label="Next week"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
