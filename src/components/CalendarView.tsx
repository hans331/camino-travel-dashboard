'use client';

import { SCHEDULE, PHASES, findTripDay } from '@/lib/data';
import type { DayData } from '@/lib/types';

const WEEKDAYS = [
  { key: 'sun', label: '일', cls: 'sun' },
  { key: 'mon', label: '월', cls: '' },
  { key: 'tue', label: '화', cls: '' },
  { key: 'wed', label: '수', cls: '' },
  { key: 'thu', label: '목', cls: '' },
  { key: 'fri', label: '금', cls: '' },
  { key: 'sat', label: '토', cls: 'sat' },
];

interface CalendarCell {
  date: Date;
  isInMonth: boolean;
  tripDay?: DayData;
}

function buildMonthWeeks(year: number, month: number): CalendarCell[][] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startWeekday = first.getDay(); // 0 = Sun

  const cells: CalendarCell[] = [];

  // Prefix: prior month days
  for (let i = startWeekday - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    cells.push({
      date: d,
      isInMonth: false,
      tripDay: findTripDay(d, SCHEDULE),
    });
  }

  // This month
  for (let day = 1; day <= last.getDate(); day++) {
    const d = new Date(year, month, day);
    cells.push({
      date: d,
      isInMonth: true,
      tripDay: findTripDay(d, SCHEDULE),
    });
  }

  // Suffix: complete the week
  while (cells.length % 7 !== 0) {
    const lastDate = cells[cells.length - 1].date;
    const next = new Date(lastDate);
    next.setDate(lastDate.getDate() + 1);
    cells.push({
      date: next,
      isInMonth: false,
      tripDay: findTripDay(next, SCHEDULE),
    });
  }

  // Split into weeks
  const weeks: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n) + '…';
}

function CalendarMonth({ year, month, today }: { year: number; month: number; today: Date }) {
  const weeks = buildMonthWeeks(year, month);
  const monthLabel = `${year}년 ${month + 1}월`;

  return (
    <div className="calendar-container">
      <h3 className="calendar-month-title">📆 {monthLabel}</h3>
      <div className="calendar-grid">
        {WEEKDAYS.map((w) => (
          <div key={w.key} className={`calendar-header ${w.cls}`}>
            {w.label}
          </div>
        ))}
        {weeks.flat().map((cell, idx) => {
          const tripDay = cell.tripDay;
          const phase = tripDay?.phase;
          const phaseColor = phase ? PHASES[phase].color : undefined;
          const isToday = isSameDay(cell.date, today);
          const isWeekend = cell.date.getDay() === 0 || cell.date.getDay() === 6;

          return (
            <div
              key={idx}
              className={`calendar-day ${!cell.isInMonth ? 'not-in-month' : ''} ${tripDay ? 'trip-day' : ''} ${isToday ? 'today' : ''}`}
              data-phase={phase}
              style={tripDay ? { borderLeftColor: phaseColor } : undefined}
              title={tripDay ? `Day ${tripDay.day}: ${tripDay.title}` : ''}
            >
              <div className="calendar-day-top">
                <span className={`calendar-day-number ${isWeekend && cell.date.getDay() === 0 ? 'sun' : ''} ${isWeekend && cell.date.getDay() === 6 ? 'sat' : ''}`}>
                  {cell.date.getDate()}
                </span>
                {tripDay && (
                  <span className={`calendar-day-badge ${tripDay.phase}`}>
                    D{tripDay.day}
                  </span>
                )}
              </div>
              {tripDay && (
                <div className="calendar-trip-content">
                  <div className="calendar-trip-emoji">{tripDay.icon}</div>
                  <div className="calendar-trip-title">{truncate(tripDay.title, 22)}</div>
                  {tripDay.dist && (
                    <div className="calendar-trip-dist">🚶 {tripDay.dist}</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CalendarView() {
  const today = new Date();

  return (
    <div className="calendar-view-wrap">
      <div className="calendar-legend">
        {Object.entries(PHASES).map(([key, info]) => (
          <div key={key} className="legend-item">
            <span className="legend-dot" style={{ background: info.color }} />
            <span>{info.emoji} {info.label}</span>
          </div>
        ))}
      </div>
      <CalendarMonth year={2026} month={5} today={today} />
      <CalendarMonth year={2026} month={6} today={today} />
    </div>
  );
}
