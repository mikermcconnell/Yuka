'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout';
import { Button } from '@/components/ui';
import {
  DailyTracker,
  WeeklyChart,
  StreakBadge,
  WeekNavigation,
} from '@/components/beers';
import { useBeerLogs } from '@/hooks/useBeerLogs';
import { useAuth } from '@/hooks/useAuth';

export default function BeersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    logs,
    weekData,
    streak,
    loading,
    error,
    addLog,
    removeLog,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
    isCurrentWeek,
  } = useBeerLogs();

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header title="Beer Tracker" />
        <main className="px-4 py-6">
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Sign in to track beers
            </h2>
            <p className="text-gray-600 mb-6">
              Your beer log will be saved when you sign in
            </p>
            <Button onClick={() => router.push('/auth/login')}>Sign In</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <Header title="Beer Tracker" />

      <main className="px-4 py-6 space-y-6">
        {/* Error display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Streak warning */}
        <StreakBadge streak={streak} />

        {/* Daily tracker */}
        <DailyTracker logs={logs} onAddLog={addLog} onRemoveLog={removeLog} />

        {/* Week navigation */}
        {weekData && (
          <WeekNavigation
            startDate={weekData.startDate}
            endDate={weekData.endDate}
            onPrevious={goToPreviousWeek}
            onNext={goToNextWeek}
            onToday={goToCurrentWeek}
            isCurrentWeek={isCurrentWeek}
          />
        )}

        {/* Weekly chart */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="animate-pulse">
              <div className="h-6 w-24 bg-gray-200 rounded mb-4" />
              <div className="h-40 bg-gray-100 rounded" />
            </div>
          </div>
        ) : (
          weekData && <WeeklyChart weekData={weekData} />
        )}
      </main>
    </div>
  );
}
