import { openDB } from "idb";
import type { IDBPDatabase } from "idb";
import type { DayEntry } from "../types";

const DB_NAME = "colorwalk";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("entries")) {
          db.createObjectStore("entries", { keyPath: "dateKey" });
        }
      },
    });
  }
  return dbPromise;
}

export async function getEntry(
  dateKey: string
): Promise<DayEntry | undefined> {
  const db = await getDB();
  return db.get("entries", dateKey);
}

export async function putEntry(entry: DayEntry): Promise<void> {
  const db = await getDB();
  await db.put("entries", entry);
}

export async function deleteEntry(dateKey: string): Promise<void> {
  const db = await getDB();
  await db.delete("entries", dateKey);
}

export async function getAllEntries(): Promise<DayEntry[]> {
  const db = await getDB();
  const entries = await db.getAll("entries");
  return entries.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getEntriesForMonth(
  year: number,
  month: number
): Promise<DayEntry[]> {
  const db = await getDB();
  const all = await db.getAll("entries");
  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  return all
    .filter((e) => e.dateKey.startsWith(prefix))
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey));
}
