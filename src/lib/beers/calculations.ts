import { BeerLog, DailyTotal, WeekData, StreakInfo } from '@/types/beers';
import { STREAK_WARNING_THRESHOLD } from './constants';

/**
 * Get the start (Monday) and end (Sunday) dates for a given week
 */
export function getWeekBoundaries(date: Date): { start: Date; end: Date } {
  const d = new Date(date);
  const day = d.getDay();
  // Adjust so Monday is 0, Sunday is 6
  const diff = day === 0 ? -6 : 1 - day;

  const start = new Date(d);
  start.setDate(d.getDate() + diff);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

/**
 * Format a date as "YYYY-MM-DD" in local timezone
 */
export function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate total ounces for a specific date
 */
export function calculateDailyTotal(logs: BeerLog[], date: string): DailyTotal {
  const dayLogs = logs.filter((log) => log.date === date);
  const totalOunces = dayLogs.reduce((sum, log) => sum + log.ounces, 0);

  return {
    date,
    totalOunces,
    logs: dayLogs,
  };
}

/**
 * Aggregate logs into week data with daily totals
 */
export function aggregateWeekData(logs: BeerLog[], weekStart: Date): WeekData {
  const { start, end } = getWeekBoundaries(weekStart);
  const days: DailyTotal[] = [];
  let totalOunces = 0;

  // Create 7 days starting from Monday
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    const dateStr = formatDateString(currentDate);

    const dayTotal = calculateDailyTotal(logs, dateStr);
    days.push(dayTotal);
    totalOunces += dayTotal.totalOunces;
  }

  return {
    startDate: start,
    endDate: end,
    days,
    totalOunces,
    averagePerDay: totalOunces / 7,
  };
}

/**
 * Calculate current drinking streak (consecutive days with logs)
 */
export function calculateStreak(logs: BeerLog[]): StreakInfo {
  if (logs.length === 0) {
    return { currentStreak: 0, isWarning: false };
  }

  // Get unique dates sorted in descending order
  const uniqueDates = Array.from(new Set(logs.map((log) => log.date))).sort().reverse();

  if (uniqueDates.length === 0) {
    return { currentStreak: 0, isWarning: false };
  }

  const today = formatDateString(new Date());
  const yesterday = formatDateString(new Date(Date.now() - 86400000));

  // Streak must include today or yesterday to be "current"
  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
    return { currentStreak: 0, isWarning: false };
  }

  let streak = 1;
  // Parse date string as local date (add T12:00:00 to avoid timezone issues)
  let currentDate = new Date(uniqueDates[0] + 'T12:00:00');

  for (let i = 1; i < uniqueDates.length; i++) {
    const expectedPrevDate = new Date(currentDate);
    expectedPrevDate.setDate(expectedPrevDate.getDate() - 1);
    const expectedPrevStr = formatDateString(expectedPrevDate);

    if (uniqueDates[i] === expectedPrevStr) {
      streak++;
      currentDate = expectedPrevDate;
    } else {
      break;
    }
  }

  return {
    currentStreak: streak,
    isWarning: streak >= STREAK_WARNING_THRESHOLD,
  };
}

/**
 * Get the day name for a date (Mon, Tue, etc.)
 */
export function getDayName(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

/**
 * Format week range for display (e.g., "Jan 20 - Jan 26")
 */
export function formatWeekRange(start: Date, end: Date): string {
  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });

  if (startMonth === endMonth) {
    return `${startMonth} ${start.getDate()} - ${end.getDate()}`;
  }
  return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}`;
}
