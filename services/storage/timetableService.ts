import { TimetableStep } from '../../constants/types';
import { getTodayDateString } from '../../utils/dateUtils';
import { storageClient } from './asyncStorageClient';

const TIMETABLE_STORAGE_KEY = '@dayflow_timetable_steps';
const TIMETABLE_LAST_DATE_KEY = '@dayflow_timetable_last_date';

const DEFAULT_TIMETABLE_STEPS: TimetableStep[] = [
  {
    id: 'tt-1',
    title: 'Morning Yoga & Meditation',
    startTime: '06:30 AM',
    endTime: '07:15 AM',
    note: 'Start with 10 min breathwork',
    completedToday: true,
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tt-2',
    title: 'Nutritious Breakfast',
    startTime: '07:30 AM',
    endTime: '08:00 AM',
    note: 'Oats, berries and green tea',
    completedToday: true,
    order: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tt-3',
    title: 'Deep Focus Work / Coding',
    startTime: '09:00 AM',
    endTime: '12:30 PM',
    note: 'No notifications or distractions',
    completedToday: true,
    order: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tt-4',
    title: 'Healthy Lunch & Fresh Air',
    startTime: '01:00 PM',
    endTime: '01:45 PM',
    note: '20 minute outdoor stroll',
    completedToday: false,
    order: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tt-5',
    title: 'Project Reviews & Meetings',
    startTime: '02:00 PM',
    endTime: '05:00 PM',
    note: 'Sync with team and review PRs',
    completedToday: false,
    order: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tt-6',
    title: 'Workout / Strength Training',
    startTime: '06:00 PM',
    endTime: '07:00 PM',
    note: 'Upper body and core circuit',
    completedToday: false,
    order: 6,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tt-7',
    title: 'Dinner & Relaxation',
    startTime: '08:00 PM',
    endTime: '09:00 PM',
    note: 'Unwind and chat with family',
    completedToday: false,
    order: 7,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tt-8',
    title: 'Night Reading & Wind Down',
    startTime: '10:00 PM',
    endTime: '10:45 PM',
    note: 'Read 20 pages of current book',
    completedToday: false,
    order: 8,
    createdAt: new Date().toISOString(),
  },
];

export const timetableService = {
  async getTimetableSteps(): Promise<TimetableStep[]> {
    const today = getTodayDateString();
    const lastDate = await storageClient.get<string | null>(TIMETABLE_LAST_DATE_KEY, null);
    let steps = await storageClient.get<TimetableStep[] | null>(TIMETABLE_STORAGE_KEY, null);

    if (!steps || steps.length === 0) {
      steps = DEFAULT_TIMETABLE_STEPS;
      await storageClient.set(TIMETABLE_STORAGE_KEY, steps);
      await storageClient.set(TIMETABLE_LAST_DATE_KEY, today);
      return steps;
    }

    // Check if new day: auto reset checkmarks!
    if (lastDate !== today) {
      steps = steps.map((s) => ({ ...s, completedToday: false }));
      await storageClient.set(TIMETABLE_STORAGE_KEY, steps);
      await storageClient.set(TIMETABLE_LAST_DATE_KEY, today);
    }

    return steps.sort((a, b) => a.order - b.order);
  },

  async toggleStep(id: string): Promise<TimetableStep[]> {
    const steps = await this.getTimetableSteps();
    const updated = steps.map((s) => (s.id === id ? { ...s, completedToday: !s.completedToday } : s));
    await storageClient.set(TIMETABLE_STORAGE_KEY, updated);
    return updated;
  },

  async addStep(stepData: Omit<TimetableStep, 'id' | 'createdAt' | 'completedToday' | 'order'>): Promise<TimetableStep[]> {
    const steps = await this.getTimetableSteps();
    const newStep: TimetableStep = {
      ...stepData,
      id: `tt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      completedToday: false,
      order: steps.length + 1,
      createdAt: new Date().toISOString(),
    };
    const updated = [...steps, newStep];
    await storageClient.set(TIMETABLE_STORAGE_KEY, updated);
    return updated;
  },

  async updateStep(id: string, updates: Partial<TimetableStep>): Promise<TimetableStep[]> {
    const steps = await this.getTimetableSteps();
    const updated = steps.map((s) => (s.id === id ? { ...s, ...updates } : s));
    await storageClient.set(TIMETABLE_STORAGE_KEY, updated);
    return updated;
  },

  async deleteStep(id: string): Promise<TimetableStep[]> {
    const steps = await this.getTimetableSteps();
    const updated = steps.filter((s) => s.id !== id);
    await storageClient.set(TIMETABLE_STORAGE_KEY, updated);
    return updated;
  },

  async resetTodayCheckins(): Promise<TimetableStep[]> {
    const steps = await this.getTimetableSteps();
    const updated = steps.map((s) => ({ ...s, completedToday: false }));
    await storageClient.set(TIMETABLE_STORAGE_KEY, updated);
    return updated;
  },
};
