export type BeerType = 'pint' | 'can';

export interface BeerLog {
  id: string;
  date: string; // "YYYY-MM-DD" for querying
  type: BeerType;
  ounces: number; // 16 or 12
  timestamp: Date;
}

export interface DailyTotal {
  date: string;
  totalOunces: number;
  logs: BeerLog[];
}

export interface WeekData {
  startDate: Date;
  endDate: Date;
  days: DailyTotal[];
  totalOunces: number;
  averagePerDay: number;
}

export interface StreakInfo {
  currentStreak: number;
  isWarning: boolean; // true if 3+ consecutive days
}
