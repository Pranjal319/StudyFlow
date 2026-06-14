export function startOfDay(value = new Date()) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function addDays(value, amount) {
  const date = new Date(value);
  date.setDate(date.getDate() + amount);
  return date;
}

export function differenceInDays(targetDate, baseDate = new Date()) {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const target = startOfDay(targetDate).getTime();
  const base = startOfDay(baseDate).getTime();
  return Math.ceil((target - base) / millisecondsPerDay);
}

export function formatDateKey(value) {
  return startOfDay(value).toISOString().split("T")[0];
}

export function buildDateLabel(value) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}
