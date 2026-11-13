import { Expense, ExpenseCategory } from '../../constants/types';
import { getTodayDateString, isDateInThisMonth, isDateInThisWeek } from '../../utils/dateUtils';
import { storageClient } from './asyncStorageClient';

const EXPENSE_STORAGE_KEY = '@dayflow_expenses';

const today = getTodayDateString();
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const threeDaysAgo = new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0];

const DEFAULT_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    amount: 350,
    category: 'Food',
    note: 'Healthy lunch bowl & smoothie',
    date: today,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp-2',
    amount: 180,
    category: 'Travel',
    note: 'Metro ride & auto fare',
    date: today,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp-3',
    amount: 1200,
    category: 'Study',
    note: 'System Design & React Native book',
    date: yesterday,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp-4',
    amount: 1450,
    category: 'Shopping',
    note: 'Ergonomic mousepad & gym bottle',
    date: threeDaysAgo,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp-5',
    amount: 250,
    category: 'Food',
    note: 'Artisan roast coffee & snack',
    date: yesterday,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp-6',
    amount: 500,
    category: 'Other',
    note: 'Cloud storage subscription',
    date: threeDaysAgo,
    createdAt: new Date().toISOString(),
  },
];

export interface ExpenseSummary {
  todayTotal: number;
  weekTotal: number;
  monthTotal: number;
  categoryTotals: Record<ExpenseCategory, number>;
  totalAll: number;
}

export const expenseService = {
  async getExpenses(): Promise<Expense[]> {
    const expenses = await storageClient.get<Expense[] | null>(EXPENSE_STORAGE_KEY, null);
    if (!expenses || expenses.length === 0) {
      await storageClient.set(EXPENSE_STORAGE_KEY, DEFAULT_EXPENSES);
      return DEFAULT_EXPENSES;
    }
    return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async addExpense(expenseData: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense[]> {
    const expenses = await this.getExpenses();
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newExpense, ...expenses];
    await storageClient.set(EXPENSE_STORAGE_KEY, updated);
    return updated;
  },

  async updateExpense(id: string, updates: Partial<Expense>): Promise<Expense[]> {
    const expenses = await this.getExpenses();
    const updated = expenses.map((e) => (e.id === id ? { ...e, ...updates } : e));
    await storageClient.set(EXPENSE_STORAGE_KEY, updated);
    return updated;
  },

  async deleteExpense(id: string): Promise<Expense[]> {
    const expenses = await this.getExpenses();
    const updated = expenses.filter((e) => e.id !== id);
    await storageClient.set(EXPENSE_STORAGE_KEY, updated);
    return updated;
  },

  getSummary(expenses: Expense[]): ExpenseSummary {
    const todayStr = getTodayDateString();
    let todayTotal = 0;
    let weekTotal = 0;
    let monthTotal = 0;
    let totalAll = 0;

    const categoryTotals: Record<ExpenseCategory, number> = {
      Food: 0,
      Travel: 0,
      Study: 0,
      Shopping: 0,
      Other: 0,
    };

    expenses.forEach((item) => {
      const amt = Number(item.amount) || 0;
      totalAll += amt;

      if (categoryTotals[item.category] !== undefined) {
        categoryTotals[item.category] += amt;
      } else {
        categoryTotals.Other += amt;
      }

      if (item.date === todayStr) {
        todayTotal += amt;
      }
      if (isDateInThisWeek(item.date)) {
        weekTotal += amt;
      }
      if (isDateInThisMonth(item.date)) {
        monthTotal += amt;
      }
    });

    return {
      todayTotal,
      weekTotal,
      monthTotal,
      categoryTotals,
      totalAll,
    };
  },
};
