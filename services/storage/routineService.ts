import { DayOfWeek, RoutineItem } from '../../constants/types';
import { storageClient } from './asyncStorageClient';

const ROUTINE_STORAGE_KEY = '@dayflow_routines';

const DEFAULT_ROUTINES: Record<DayOfWeek, RoutineItem[]> = {
  Mon: [
    { id: 'mon-1', day: 'Mon', time: '06:30 AM', title: 'Weekly Goal Setting & Priority Audit', description: 'Define top 3 objectives for the week', category: 'Focus', order: 1 },
    { id: 'mon-2', day: 'Mon', time: '08:00 AM', title: 'Team Kickoff & Calendar Sync', description: 'Clear roadblocks and assign tasks', category: 'Work', order: 2 },
    { id: 'mon-3', day: 'Mon', time: '06:00 PM', title: 'Leg Day & High-Intensity Cardio', description: 'Squats, lunges, 20m treadmill sprint', category: 'Fitness', order: 3 },
  ],
  Tue: [
    { id: 'tue-1', day: 'Tue', time: '07:00 AM', title: 'Core Strength & Mobility Workout', description: 'Plank variations and hip openers', category: 'Fitness', order: 1 },
    { id: 'tue-2', day: 'Tue', time: '09:30 AM', title: 'Deep Architectural Design Session', description: 'Component tree and data flow specs', category: 'Focus', order: 2 },
    { id: 'tue-3', day: 'Tue', time: '07:30 PM', title: 'Technical Podcast / Audio Paper', description: 'Listen to latest system design podcast', category: 'Study', order: 3 },
  ],
  Wed: [
    { id: 'wed-1', day: 'Wed', time: '06:45 AM', title: 'Outdoor Running (5 KM)', description: 'Paced run through the park', category: 'Fitness', order: 1 },
    { id: 'wed-2', day: 'Wed', time: '02:00 PM', title: 'Mid-week Progress Check & Cleanup', description: 'Clear backlog items and respond to emails', category: 'Work', order: 2 },
    { id: 'wed-3', day: 'Wed', time: '09:00 PM', title: 'Digital Detox & Evening Journal', description: 'Screen-off 1 hour before sleeping', category: 'Wellness', order: 3 },
  ],
  Thu: [
    { id: 'thu-1', day: 'Thu', time: '07:00 AM', title: 'Upper Body Hypertrophy Circuit', description: 'Bench press, pull-ups, overhead press', category: 'Fitness', order: 1 },
    { id: 'thu-2', day: 'Thu', time: '11:00 AM', title: 'Feature Development Sprint', description: 'Implement core modules without interruption', category: 'Work', order: 2 },
    { id: 'thu-3', day: 'Thu', time: '08:00 PM', title: 'Skill Building & Reading', description: 'TypeScript performance best practices', category: 'Study', order: 3 },
  ],
  Fri: [
    { id: 'fri-1', day: 'Fri', time: '07:30 AM', title: 'Full Body Stretch & Meditation', description: 'Gentle flow and calming breathing', category: 'Wellness', order: 1 },
    { id: 'fri-2', day: 'Fri', time: '04:00 PM', title: 'Weekly Retro & Clean Inbox Zero', description: 'Review weekly wins and archive tickets', category: 'Work', order: 2 },
    { id: 'fri-3', day: 'Fri', time: '07:30 PM', title: 'Casual Dinner & Movie Night', description: 'Unwind with friends or family', category: 'Leisure', order: 3 },
  ],
  Sat: [
    { id: 'sat-1', day: 'Sat', time: '08:00 AM', title: 'Farmer\'s Market & Grocery Run', description: 'Fresh veggies, fruits and snacks', category: 'Life', order: 1 },
    { id: 'sat-2', day: 'Sat', time: '11:00 AM', title: 'Side Project Creative Exploration', description: 'Build innovative prototypes and experiment', category: 'Creativity', order: 2 },
    { id: 'sat-3', day: 'Sat', time: '05:00 PM', title: 'Outdoor Sports / Cycling / Swimming', description: 'Enjoy nature and get active', category: 'Fitness', order: 3 },
  ],
  Sun: [
    { id: 'sun-1', day: 'Sun', time: '08:30 AM', title: 'Relaxed Sunday Brunch & Coffee', description: 'Slow morning with favorite brew', category: 'Leisure', order: 1 },
    { id: 'sun-2', day: 'Sun', time: '03:00 PM', title: 'Meal Prep & Home Organization', description: 'Prep healthy lunches for Mon-Wed', category: 'Life', order: 2 },
    { id: 'sun-3', day: 'Sun', time: '07:00 PM', title: 'Plan Next Week & Outfit Prep', description: 'Review upcoming appointments', category: 'Focus', order: 3 },
  ],
};

export const routineService = {
  async getAllRoutines(): Promise<Record<DayOfWeek, RoutineItem[]>> {
    const routines = await storageClient.get<Record<DayOfWeek, RoutineItem[]> | null>(ROUTINE_STORAGE_KEY, null);
    if (!routines) {
      await storageClient.set(ROUTINE_STORAGE_KEY, DEFAULT_ROUTINES);
      return DEFAULT_ROUTINES;
    }
    return routines;
  },

  async getRoutineForDay(day: DayOfWeek): Promise<RoutineItem[]> {
    const all = await this.getAllRoutines();
    return (all[day] || []).sort((a, b) => a.order - b.order);
  },

  async addRoutineItem(day: DayOfWeek, itemData: Omit<RoutineItem, 'id' | 'day' | 'order'>): Promise<Record<DayOfWeek, RoutineItem[]>> {
    const all = await this.getAllRoutines();
    const dayItems = all[day] || [];
    const newItem: RoutineItem = {
      ...itemData,
      id: `rt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      day,
      order: dayItems.length + 1,
    };
    all[day] = [...dayItems, newItem];
    await storageClient.set(ROUTINE_STORAGE_KEY, all);
    return all;
  },

  async updateRoutineItem(day: DayOfWeek, id: string, updates: Partial<RoutineItem>): Promise<Record<DayOfWeek, RoutineItem[]>> {
    const all = await this.getAllRoutines();
    if (all[day]) {
      all[day] = all[day].map((item) => (item.id === id ? { ...item, ...updates } : item));
      await storageClient.set(ROUTINE_STORAGE_KEY, all);
    }
    return all;
  },

  async deleteRoutineItem(day: DayOfWeek, id: string): Promise<Record<DayOfWeek, RoutineItem[]>> {
    const all = await this.getAllRoutines();
    if (all[day]) {
      all[day] = all[day].filter((item) => item.id !== id);
      await storageClient.set(ROUTINE_STORAGE_KEY, all);
    }
    return all;
  },

  async copyRoutineToDays(sourceDay: DayOfWeek, targetDays: DayOfWeek[]): Promise<Record<DayOfWeek, RoutineItem[]>> {
    const all = await this.getAllRoutines();
    const sourceItems = all[sourceDay] || [];

    targetDays.forEach((target) => {
      // Create fresh cloned items for the target day
      all[target] = sourceItems.map((item, index) => ({
        ...item,
        id: `rt-copy-${Date.now()}-${target}-${index}`,
        day: target,
      }));
    });

    await storageClient.set(ROUTINE_STORAGE_KEY, all);
    return all;
  },
};
