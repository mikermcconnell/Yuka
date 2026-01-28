'use client';

import { StreakInfo } from '@/types/beers';

interface StreakBadgeProps {
  streak: StreakInfo;
}

export default function StreakBadge({ streak }: StreakBadgeProps) {
  if (!streak.isWarning) {
    return null;
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
      <div className="flex-shrink-0">
        <svg
          className="w-6 h-6 text-amber-500"
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
      </div>
      <div>
        <h3 className="font-semibold text-amber-800">
          {streak.currentStreak} Day Streak
        </h3>
        <p className="text-sm text-amber-700 mt-1">
          You&apos;ve been drinking for {streak.currentStreak} consecutive days.
          Consider taking a break.
        </p>
      </div>
    </div>
  );
}
