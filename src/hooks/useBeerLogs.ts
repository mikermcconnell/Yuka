'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { BeerLog, BeerType, WeekData, StreakInfo } from '@/types/beers';
import {
  addBeerLog,
  deleteBeerLog,
  getBeerLogsForDateRange,
} from '@/lib/firebase/firestore';
import {
  getWeekBoundaries,
  formatDateString,
  aggregateWeekData,
  calculateStreak,
  calculateDailyTotal,
} from '@/lib/beers/calculations';
import { PINT_OUNCES, CAN_OUNCES } from '@/lib/beers/constants';
import { getErrorMessage } from '@/lib/utils/formatters';
import { useAuth } from './useAuth';

interface UseBeerLogsReturn {
  logs: BeerLog[];
  weekData: WeekData | null;
  todayTotal: number;
  streak: StreakInfo;
  loading: boolean;
  error: string | null;
  currentWeekStart: Date;
  addLog: (type: BeerType, date?: string) => Promise<void>;
  removeLog: (logId: string) => Promise<void>;
  goToPreviousWeek: () => void;
  goToNextWeek: () => void;
  goToCurrentWeek: () => void;
  isCurrentWeek: boolean;
  refresh: () => Promise<void>;
}

export function useBeerLogs(): UseBeerLogsReturn {
  const { user } = useAuth();
  const [logs, setLogs] = useState<BeerLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    return getWeekBoundaries(new Date()).start;
  });

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchLogs = useCallback(async () => {
    if (!user) {
      setLogs([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { start, end } = getWeekBoundaries(currentWeekStart);
      // Extend range to include previous week for streak calculation
      const extendedStart = new Date(start);
      extendedStart.setDate(extendedStart.getDate() - 7);

      const entries = await getBeerLogsForDateRange(
        user.uid,
        formatDateString(extendedStart),
        formatDateString(end)
      );

      if (mountedRef.current) {
        setLogs(entries);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(getErrorMessage(err, 'Failed to fetch beer logs'));
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [user, currentWeekStart]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const addLog = useCallback(
    async (type: BeerType, date?: string) => {
      if (!user) {
        throw new Error('Must be logged in to add beer logs');
      }

      try {
        const id = await addBeerLog(user.uid, type, date);
        const now = new Date();
        const logDate = date || formatDateString(now);
        const newLog: BeerLog = {
          id,
          date: logDate,
          type,
          ounces: type === 'pint' ? PINT_OUNCES : CAN_OUNCES,
          timestamp: now,
        };
        setLogs((prev) => [newLog, ...prev]);
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to add beer log'));
        throw err;
      }
    },
    [user]
  );

  const removeLog = useCallback(
    async (logId: string) => {
      if (!user) {
        throw new Error('Must be logged in');
      }

      try {
        await deleteBeerLog(user.uid, logId);
        setLogs((prev) => prev.filter((log) => log.id !== logId));
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to remove beer log'));
        throw err;
      }
    },
    [user]
  );

  const goToPreviousWeek = useCallback(() => {
    setCurrentWeekStart((prev) => {
      const newStart = new Date(prev);
      newStart.setDate(newStart.getDate() - 7);
      return newStart;
    });
  }, []);

  const goToNextWeek = useCallback(() => {
    setCurrentWeekStart((prev) => {
      const newStart = new Date(prev);
      newStart.setDate(newStart.getDate() + 7);
      return newStart;
    });
  }, []);

  const goToCurrentWeek = useCallback(() => {
    setCurrentWeekStart(getWeekBoundaries(new Date()).start);
  }, []);

  // Calculate derived data
  const weekData = aggregateWeekData(logs, currentWeekStart);
  const streak = calculateStreak(logs);
  const today = formatDateString(new Date());
  const todayTotal = calculateDailyTotal(logs, today).totalOunces;

  // Check if viewing current week
  const currentWeekBoundary = getWeekBoundaries(new Date()).start;
  const isCurrentWeek =
    formatDateString(currentWeekStart) === formatDateString(currentWeekBoundary);

  return {
    logs,
    weekData,
    todayTotal,
    streak,
    loading,
    error,
    currentWeekStart,
    addLog,
    removeLog,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
    isCurrentWeek,
    refresh: fetchLogs,
  };
}
