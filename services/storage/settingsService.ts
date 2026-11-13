import { ThemePreference } from '../../constants/types';
import { storageClient } from './asyncStorageClient';

const THEME_PREF_KEY = '@dayflow_theme_preference';

export const settingsService = {
  async getThemePreference(): Promise<ThemePreference> {
    return await storageClient.get<ThemePreference>(THEME_PREF_KEY, 'system');
  },

  async setThemePreference(pref: ThemePreference): Promise<boolean> {
    return await storageClient.set<ThemePreference>(THEME_PREF_KEY, pref);
  },
};
