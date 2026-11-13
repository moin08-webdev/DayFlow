import { DayOfWeek, DAYS_OF_WEEK } from '../constants/types';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentDayOfWeek(): DayOfWeek {
  const dayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday
  // Convert so 0: Mon, 1: Tue, ..., 6: Sun
  const mapped = dayIndex === 0 ? 6 : dayIndex - 1;
  return DAYS_OF_WEEK[mapped];
}

export function formatFriendlyDate(dateStr: string): string {
  const today = getTodayDateString();
  if (dateStr === today) return 'Today';

  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;

  const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

export function isDateInThisWeek(dateStr: string): boolean {
  const [year, month, day] = dateStr.split('-').map(Number);
  const target = new Date(year, month - 1, day);
  const now = new Date();

  // Find start of current week (Monday)
  const currentDay = now.getDay();
  const diffToMonday = (currentDay === 0 ? -6 : 1) - currentDay;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return target >= monday && target <= sunday;
}

export function isDateInThisMonth(dateStr: string): boolean {
  const now = new Date();
  const [year, month] = dateStr.split('-').map(Number);
  return year === now.getFullYear() && month === now.getMonth() + 1;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function getFormattedTodayHeader(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
  return now.toLocaleDateString(undefined, options);
}
