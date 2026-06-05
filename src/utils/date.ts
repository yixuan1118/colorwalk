// 日期工具函数

export function getTodayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatDateCN(dateKey: string): string {
  const [y, m, d] = dateKey.split("-");
  return `${y}年${Number(m)}月${Number(d)}日`;
}

export function getYearMonth(dateKey: string): { year: number; month: number } {
  const [y, m] = dateKey.split("-");
  return { year: Number(y), month: Number(m) };
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function getFirstDayOfWeek(year: number, month: number): number {
  // 返回当月1号是星期几 (0=周日, 1=周一, ..., 6=周六)
  return new Date(year, month - 1, 1).getDay();
}
