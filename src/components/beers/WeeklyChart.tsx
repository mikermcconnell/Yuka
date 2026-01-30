'use client';

import { WeekData } from '@/types/beers';
import { WEEKLY_LIMIT } from '@/lib/beers/constants';
import { getDayName, formatDateString } from '@/lib/beers/calculations';

interface WeeklyChartProps {
  weekData: WeekData;
}

export default function WeeklyChart({ weekData }: WeeklyChartProps) {
  const { days, totalOunces } = weekData;

  // Find max value for scaling (at least WEEKLY_LIMIT / 7 for reference)
  const dailyLimit = WEEKLY_LIMIT / 7;
  const maxDaily = Math.max(...days.map((d) => d.totalOunces), dailyLimit * 1.5);

  const today = formatDateString(new Date());

  // Chart dimensions
  const chartHeight = 160;
  const barWidth = 32;
  const barGap = 8;
  const chartWidth = (barWidth + barGap) * 7 - barGap;
  const limitLineY = chartHeight - (dailyLimit / maxDaily) * chartHeight;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">This Week</h2>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{totalOunces}</div>
          <div className="text-xs text-gray-500">of {WEEKLY_LIMIT}oz limit</div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="flex justify-center">
        <svg
          width={chartWidth + 40}
          height={chartHeight + 40}
          viewBox={`0 0 ${chartWidth + 40} ${chartHeight + 40}`}
          className="overflow-visible"
        >
          {/* Limit line */}
          <line
            x1={20}
            y1={limitLineY + 10}
            x2={chartWidth + 20}
            y2={limitLineY + 10}
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="4 4"
          />
          <text
            x={chartWidth + 25}
            y={limitLineY + 14}
            fill="#f59e0b"
            fontSize={10}
            fontWeight={500}
          >
            {Math.round(dailyLimit)}
          </text>

          {/* Bars */}
          {days.map((day, i) => {
            const barHeight =
              day.totalOunces > 0
                ? (day.totalOunces / maxDaily) * chartHeight
                : 0;
            const x = 20 + i * (barWidth + barGap);
            const y = chartHeight - barHeight + 10;
            const isToday = day.date === today;
            const isOverLimit = day.totalOunces > dailyLimit;

            // Determine bar color
            let barColor = '#e5e7eb'; // empty/gray
            if (day.totalOunces > 0) {
              barColor = isOverLimit ? '#f59e0b' : '#22c55e'; // amber if over, green if under
            }

            const dayDate = new Date(day.date + 'T12:00:00');

            return (
              <g key={day.date}>
                {/* Bar background (for empty state) */}
                <rect
                  x={x}
                  y={10}
                  width={barWidth}
                  height={chartHeight}
                  fill="#f3f4f6"
                  rx={4}
                />

                {/* Actual bar */}
                {barHeight > 0 && (
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={barColor}
                    rx={4}
                  />
                )}

                {/* Today indicator */}
                {isToday && (
                  <circle
                    cx={x + barWidth / 2}
                    cy={chartHeight + 30}
                    r={3}
                    fill="#3b82f6"
                  />
                )}

                {/* Day label */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 25}
                  textAnchor="middle"
                  fill={isToday ? '#3b82f6' : '#9ca3af'}
                  fontSize={11}
                  fontWeight={isToday ? 600 : 400}
                >
                  {getDayName(dayDate)}
                </text>

                {/* Value on top of bar if non-zero */}
                {day.totalOunces > 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 4}
                    textAnchor="middle"
                    fill="#6b7280"
                    fontSize={10}
                    fontWeight={500}
                  >
                    {day.totalOunces}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span>Under limit</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-amber-500" />
          <span>Over limit</span>
        </div>
      </div>
    </div>
  );
}
