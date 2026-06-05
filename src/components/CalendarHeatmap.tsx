import { useState } from "react";
import type { DayEntry } from "../types";
import {
  getDaysInMonth,
  getFirstDayOfWeek,
  getTodayKey,
  getYearMonth,
} from "../utils/date";
import styles from "../styles/CalendarPage.module.css";

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

interface Props {
  entries: DayEntry[];
  onDayClick: (dateKey: string) => void;
}

export default function CalendarHeatmap({ entries, onDayClick }: Props) {
  const today = getTodayKey();
  const { year: todayYear, month: todayMonth } = getYearMonth(today);
  const [viewYear, setViewYear] = useState(todayYear);
  const [viewMonth, setViewMonth] = useState(todayMonth);

  const entryMap = new Map(entries.map((e) => [e.dateKey, e]));

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDayOfWeek = getFirstDayOfWeek(viewYear, viewMonth);

  const cells: Array<{ dateKey: string; day: number; entry?: DayEntry }> = [];

  // 前置空白格
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push({ dateKey: "", day: 0 });
  }

  // 当月日期
  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${viewYear}-${String(viewMonth).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({
      dateKey,
      day: d,
      entry: entryMap.get(dateKey),
    });
  }

  const goPrev = () => {
    if (viewMonth === 1) {
      setViewYear(viewYear - 1);
      setViewMonth(12);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goNext = () => {
    if (viewMonth === 12) {
      setViewYear(viewYear + 1);
      setViewMonth(1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  return (
    <div>
      <div className={styles.monthNav}>
        <button className={styles.navBtn} onClick={goPrev} aria-label="上一月">
          ‹
        </button>
        <span className={styles.monthLabel}>
          {viewYear} 年 {viewMonth} 月
        </span>
        <button className={styles.navBtn} onClick={goNext} aria-label="下一月">
          ›
        </button>
      </div>

      <div className={styles.weekHeader}>
        {WEEKDAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className={styles.calendarGrid}>
        {cells.map((cell, i) => {
          if (cell.day === 0) {
            return <div key={`empty-${i}`} />;
          }

          const isToday = cell.dateKey === today;
          const hasEntry = !!cell.entry;

          return (
            <button
              key={cell.dateKey}
              className={`${styles.dayCell} ${
                hasEntry ? styles.dayCellHasEntry : styles.dayCellEmpty
              } ${isToday ? styles.dayCellToday : ""}`}
              style={
                hasEntry
                  ? { backgroundColor: cell.entry!.colorHex }
                  : undefined
              }
              onClick={() => hasEntry && onDayClick(cell.dateKey)}
              aria-label={cell.dateKey}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
