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

// Ideas & Roadmap Types
export type IdeaStatus = 'Brainstorming' | 'In Progress' | 'Shipped' | 'Paused';

export interface RoadmapStep {
  id: string;
  title: string;
  description?: string;
  targetDate?: string;
  completed: boolean;
  order: number;
}

export interface Idea {
  id: string;
  title: string;
  tag: string; // e.g. "SaaS", "Mobile App", "Content", "Career"
  description?: string;
  status: IdeaStatus;
  targetDate?: string;
  roadmap: RoadmapStep[];
  createdAt: string;
}

// Vault & Private Info Types
export interface VaultFile {
  id: string;
  name: string;
  icon: string; // Ionicons glyph name
  description?: string;
  createdAt: string;
}

export interface VaultRow {
  id: string;
  fileId: string;
  name: string;        // e.g. "Supabase", "OpenAI Key", "Figma"
  value: string;       // Link URL or Secret key or Info
  description: string; // What it does / notes
  tag?: string;        // e.g. "Backend", "AI", "Production"
  isSecret?: boolean;  // Hide/reveal with eye toggle
  createdAt: string;
}
