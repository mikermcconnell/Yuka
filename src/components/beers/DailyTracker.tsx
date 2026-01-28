'use client';

import { useState } from 'react';
import { BeerLog, BeerType } from '@/types/beers';
import { PINT_OUNCES, CAN_OUNCES } from '@/lib/beers/constants';
import { formatDateString, calculateDailyTotal } from '@/lib/beers/calculations';

interface DailyTrackerProps {
  logs: BeerLog[];
  onAddLog: (type: BeerType, date?: string) => Promise<void>;
  onRemoveLog: (logId: string) => Promise<void>;
}

function formatDayHeader(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateStr = formatDateString(date);
  const todayStr = formatDateString(today);
  const yesterdayStr = formatDateString(yesterday);

  if (dateStr === todayStr) return 'Today';
  if (dateStr === yesterdayStr) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export default function DailyTracker({
  logs,
  onAddLog,
  onRemoveLog,
}: DailyTrackerProps) {
  const [adding, setAdding] = useState<BeerType | null>(null);
  const [undoing, setUndoing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const today = formatDateString(new Date());
  const selectedDateStr = formatDateString(selectedDate);
  const isToday = selectedDateStr === today;
  const { totalOunces, logs: dayLogs } = calculateDailyTotal(logs, selectedDateStr);

  const goToPreviousDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };

  const goToNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    // Don't allow going past today
    if (formatDateString(next) <= today) {
      setSelectedDate(next);
    }
  };

  const handleAdd = async (type: BeerType) => {
    setAdding(type);
    try {
      await onAddLog(type, selectedDateStr);
    } finally {
      setAdding(null);
    }
  };

  const handleUndo = async () => {
    if (dayLogs.length === 0 || undoing) return;
    setUndoing(true);
    try {
      // Remove the most recent log from selected day (don't mutate original array)
      const sortedLogs = [...dayLogs].sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      );
      await onRemoveLog(sortedLogs[0].id);
    } finally {
      setUndoing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {/* Day navigation header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousDay}
          className="p-2 -ml-2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Previous day"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-gray-900">{formatDayHeader(selectedDate)}</h2>
        <button
          onClick={goToNextDay}
          disabled={isToday}
          className="p-2 -mr-2 text-gray-400 hover:text-gray-600 disabled:text-gray-200 disabled:cursor-not-allowed transition-colors"
          aria-label="Next day"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day's total */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-gray-900">{totalOunces}</div>
        <div className="text-sm text-gray-500">ounces {isToday ? 'today' : 'this day'}</div>
      </div>

      {/* Add buttons */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => handleAdd('pint')}
          disabled={adding !== null}
          className="flex-1 py-4 px-4 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-medium rounded-xl transition-colors"
        >
          {adding === 'pint' ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </span>
          ) : (
            <>
              <span className="block text-lg">Pint</span>
              <span className="block text-sm opacity-80">+{PINT_OUNCES}oz</span>
            </>
          )}
        </button>

        <button
          onClick={() => handleAdd('can')}
          disabled={adding !== null}
          className="flex-1 py-4 px-4 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-medium rounded-xl transition-colors"
        >
          {adding === 'can' ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </span>
          ) : (
            <>
              <span className="block text-lg">Can</span>
              <span className="block text-sm opacity-80">+{CAN_OUNCES}oz</span>
            </>
          )}
        </button>
      </div>

      {/* Undo button */}
      {dayLogs.length > 0 && (
        <button
          onClick={handleUndo}
          disabled={undoing}
          className="w-full py-2 text-gray-500 hover:text-gray-700 disabled:text-gray-300 text-sm font-medium transition-colors"
        >
          {undoing ? 'Removing...' : `Undo last (${dayLogs.length} logged)`}
        </button>
      )}
    </div>
  );
}
