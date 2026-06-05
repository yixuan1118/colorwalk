import { useState, useEffect, useCallback } from "react";
import type { DayEntry } from "../types";
import { getAllEntries, getEntry } from "../data/db";

export function useHistory() {
  const [entries, setEntries] = useState<DayEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    getAllEntries().then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { entries, loading, refresh };
}

export function useDayEntry(dateKey: string | null) {
  const [entry, setEntry] = useState<DayEntry | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!dateKey) return;
    setLoading(true);
    getEntry(dateKey).then((data) => {
      setEntry(data ?? null);
      setLoading(false);
    });
  }, [dateKey]);

  return { entry, loading };
}
