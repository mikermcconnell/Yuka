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
  weekData: WeekData;
  todayTotal: number;
  streak: StreakInfo;
  loading: boolean;
  error: string | null;
  currentWeekStart: Date;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  addLog: (type: BeerType, date?: string) => Promise<void>;
  removeLog: (logId: string) => Promise<void>;
  goToPreviousWeek: () => void;
  goToNextWeek: () => void;
  goToCurrentWeek: () => void;
  goToPreviousDay: () => void;
  goToNextDay: () => void;
  isCurrentWeek: boolean;
  isToday: boolean;
  refresh: () => Promise<void>;
}

export function useBeerLogs(): UseBeerLogsReturn {
  const { user } = useAuth();
  const [logs, setLogs] = useState<BeerLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    return getWeekBoundaries(new Date()).start;
  });
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  const mountedRef = useRef(true);
  const requestIdRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Use user.uid instead of user object to prevent refetches on object reference changes
  const userId = user?.uid;

  const fetchLogs = useCallback(async () => {
    if (!userId) {
      setLogs([]);
      setLoading(false);
      return;
    }

    const thisRequestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const { start, end } = getWeekBoundaries(currentWeekStart);
      // Extend range to include previous week for streak calculation
      const extendedStart = new Date(start);
      extendedStart.setDate(extendedStart.getDate() - 7);

      const entries = await getBeerLogsForDateRange(
        userId,
        formatDateString(extendedStart),
        formatDateString(end)
      );

      // Only update state if this is still the most recent request
      if (thisRequestId === requestIdRef.current && mountedRef.current) {
        setLogs(entries);
      }
    } catch (err) {
      if (thisRequestId === requestIdRef.current && mountedRef.current) {
        setError(getErrorMessage(err, 'Failed to fetch beer logs'));
      }
    } finally {
      if (thisRequestId === requestIdRef.current && mountedRef.current) {
        setLoading(false);
      }
    }
  }, [userId, currentWeekStart]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const addLog = useCallback(
    async (type: BeerType, date?: string) => {
      if (!userId) {
        throw new Error('Must be logged in to add beer logs');
      }

      try {
        const id = await addBeerLog(userId, type, date);
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
    [userId]
  );

  const removeLog = useCallback(
    async (logId: string) => {
      if (!userId) {
        throw new Error('Must be logged in');
      }

      try {
        await deleteBeerLog(userId, logId);
        setLogs((prev) => prev.filter((log) => log.id !== logId));
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to remove beer log'));
        throw err;
      }
    },
    [userId]
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
    setSelectedDate(new Date());
  }, []);

  const goToPreviousDay = useCallback(() => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      // If moving to a different week, update week view too
      const newWeekStart = getWeekBoundaries(newDate).start;
      if (formatDateString(newWeekStart) !== formatDateString(currentWeekStart)) {
        setCurrentWeekStart(newWeekStart);
      }
      return newDate;
    });
  }, [currentWeekStart]);

  const goToNextDay = useCallback(() => {
    const today = new Date();
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 1);
      // Don't go past today
      if (newDate > today) {
        return prev;
      }
      // If moving to a different week, update week view too
      const newWeekStart = getWeekBoundaries(newDate).start;
      if (formatDateString(newWeekStart) !== formatDateString(currentWeekStart)) {
        setCurrentWeekStart(newWeekStart);
      }
      return newDate;
    });
  }, [currentWeekStart]);

  // Calculate derived data
  const weekData = aggregateWeekData(logs, currentWeekStart);
  const streak = calculateStreak(logs);
  const today = formatDateString(new Date());
  const todayTotal = calculateDailyTotal(logs, today).totalOunces;

  // Check if viewing current week
  const currentWeekBoundary = getWeekBoundaries(new Date()).start;
  const isCurrentWeek =
    formatDateString(currentWeekStart) === formatDateString(currentWeekBoundary);

  // Check if selected date is today
  const isToday = formatDateString(selectedDate) === today;

  return {
    logs,
    weekData,
    todayTotal,
    streak,
    loading,
    error,
    currentWeekStart,
    selectedDate,
    setSelectedDate,
    addLog,
    removeLog,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
    goToPreviousDay,
    goToNextDay,
    isCurrentWeek,
    isToday,
    refresh: fetchLogs,
  };
}
