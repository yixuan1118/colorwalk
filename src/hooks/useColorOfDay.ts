import { useState, useEffect } from "react";
import type { DayEntry } from "../types";
import { getEntry } from "../data/db";
import { getTodayKey } from "../utils/date";

export function useColorOfDay() {
  const [todayEntry, setTodayEntry] = useState<DayEntry | null>(null);
  const [loading, setLoading] = useState(true);

  const todayKey = getTodayKey();

  useEffect(() => {
    getEntry(todayKey).then((entry) => {
      if (entry) setTodayEntry(entry);
      setLoading(false);
    });
  }, [todayKey]);

  return {
    todayKey,
    todayEntry,
    loading,
    hasTodayEntry: !!todayEntry,
  };
}
