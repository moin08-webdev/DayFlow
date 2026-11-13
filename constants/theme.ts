export const Palette = {
  indigo: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
  },
  violet: {
    500: '#8B5CF6',
    600: '#7C3AED',
  },
  cyan: {
    400: '#22D3EE',
    500: '#06B6D4',
  },
  emerald: {
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
  },
  amber: {
    400: '#FBBF24',
    500: '#F59E0B',
  },
  rose: {
    400: '#FB7185',
    500: '#F43F5E',
  },
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#0B0F19',
  },
};

export const CategoryColors: Record<string, { bg: string; text: string; gradient: [string, string] }> = {
  Food: { bg: '#FFEDD5', text: '#EA580C', gradient: ['#FB923C', '#EA580C'] },
  Travel: { bg: '#CFFAFE', text: '#0891B2', gradient: ['#22D3EE', '#0891B2'] },
  Study: { bg: '#EDE9FE', text: '#7C3AED', gradient: ['#A78BFA', '#7C3AED'] },
  Shopping: { bg: '#FCE7F3', text: '#DB2777', gradient: ['#F472B6', '#DB2777'] },
  Other: { bg: '#E2E8F0', text: '#475569', gradient: ['#94A3B8', '#475569'] },
};

export const PriorityColors = {
  low: {
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.25)',
    label: 'Low',
  },
  medium: {
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.25)',
    label: 'Medium',
  },
  high: {
    color: '#F43F5E',
    bg: 'rgba(244, 63, 94, 0.12)',
    border: 'rgba(244, 63, 94, 0.25)',
    label: 'High',
  },
};

export interface ThemeColors {
  isDark: boolean;
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceSubtle: string;
  border: string;
  borderSubtle: string;
  borderHighlight: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  tint: string;
  tabIconDefault: string;
  tabIconSelected: string;
  shadowColor: string;
  cardGradStart: string;
  cardGradEnd: string;
  glassBorder: string;
}

export const lightTheme: ThemeColors = {
  isDark: false,
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceSubtle: '#F1F5F9',
  border: '#E2E8F0',
  borderSubtle: '#EDF2F7',
  borderHighlight: 'rgba(99, 102, 241, 0.2)',
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  secondary: '#06B6D4',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#F43F5E',
  tint: '#6366F1',
  tabIconDefault: '#94A3B8',
  tabIconSelected: '#6366F1',
  shadowColor: '#0F172A',
  cardGradStart: '#FFFFFF',
  cardGradEnd: '#F8FAFC',
  glassBorder: 'rgba(255, 255, 255, 0.8)',
};

export const darkTheme: ThemeColors = {
  isDark: true,
  background: '#0B0F19',
  surface: '#131B2E',
  surfaceElevated: '#1E293B',
  surfaceSubtle: '#182234',
  border: 'rgba(255, 255, 255, 0.08)',
  borderSubtle: 'rgba(255, 255, 255, 0.05)',
  borderHighlight: 'rgba(129, 140, 248, 0.25)',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  primary: '#818CF8',
  primaryLight: '#A5B4FC',
  primaryDark: '#6366F1',
  secondary: '#22D3EE',
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#FB7185',
  tint: '#818CF8',
  tabIconDefault: '#64748B',
  tabIconSelected: '#818CF8',
  shadowColor: '#000000',
  cardGradStart: '#182236',
  cardGradEnd: '#111827',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
};
