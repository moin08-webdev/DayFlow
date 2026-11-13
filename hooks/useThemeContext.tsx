import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { darkTheme, lightTheme, ThemeColors } from '../constants/theme';
import { ThemePreference } from '../constants/types';
import { settingsService } from '../services/storage/settingsService';

interface ThemeContextValue {
  theme: ThemeColors;
  isDark: boolean;
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => Promise<void>;
  toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: darkTheme,
  isDark: true,
  preference: 'system',
  setPreference: async () => {},
  toggleTheme: async () => {},
});

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    settingsService.getThemePreference().then((pref) => {
      setPreferenceState(pref);
      setIsLoaded(true);
    });
  }, []);

  const setPreference = async (newPref: ThemePreference) => {
    setPreferenceState(newPref);
    await settingsService.setThemePreference(newPref);
  };

  const isDark =
    preference === 'system'
      ? systemScheme === 'dark'
      : preference === 'dark';

  const toggleTheme = async () => {
    const nextPref: ThemePreference = isDark ? 'light' : 'dark';
    await setPreference(nextPref);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        preference,
        setPreference,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeContextProvider');
  }
  return context;
}
