export type Priority = 'low' | 'medium' | 'high';

export interface TimetableStep {
  id: string;
  title: string;
  startTime: string; // e.g. "06:30 AM"
  endTime: string;   // e.g. "07:30 AM"
  note?: string;
  category?: string;
  completedToday: boolean;
  order: number;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string; // "YYYY-MM-DD"
  category?: string;
  completedAt?: string;
  createdAt: string;
}

export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export const DAYS_OF_WEEK: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const DAY_NAMES: Record<DayOfWeek, string> = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
};

export interface RoutineItem {
  id: string;
  day: DayOfWeek;
  time: string; // e.g. "07:00 AM"
  title: string;
  description?: string;
  category?: string;
  order: number;
}

export type ExpenseCategory = 'Food' | 'Travel' | 'Study' | 'Shopping' | 'Other';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = ['Food', 'Travel', 'Study', 'Shopping', 'Other'];

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  note?: string;
  date: string; // "YYYY-MM-DD"
  createdAt: string;
}

export type ThemePreference = 'system' | 'light' | 'dark';
