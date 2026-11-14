export function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export function isFutureDate(date) {
  return date > todayString();
}

export function getMonthRange(date) {
  const [year, month] = date.split('-').map(Number);
  const start = `${year}-${String(month).padStart(2, '0')}-01`;
  const next = new Date(Date.UTC(year, month, 1));
  const end = next.toISOString().slice(0, 10);
  return { start, end };
}
