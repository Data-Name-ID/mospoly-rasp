import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ViewMode } from '../api/types';

export interface FiltersState {
  types: string[];
  format: 'all' | 'online' | 'offline';
  showAllDates: boolean;
}

interface SettingsState {
  group: string;
  theme: 'light' | 'dark' | 'system';
  viewMode: ViewMode;
  filters: FiltersState;
  setGroup: (group: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setViewMode: (mode: ViewMode) => void;
  setFilters: (filters: Partial<FiltersState>) => void;
  resetFilters: () => void;
}

const defaultFilters: FiltersState = {
  types: [],
  format: 'all',
  showAllDates: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      group: '',
      theme: 'system',
      viewMode: 'today',
      filters: { ...defaultFilters },
      setGroup: (group) => set({ group }),
      setTheme: (theme) => set({ theme }),
      setViewMode: (viewMode) => set({ viewMode }),
      setFilters: (partial) =>
        set((state) => ({
          filters: { ...state.filters, ...partial },
        })),
      resetFilters: () => set({ filters: { ...defaultFilters } }),
    }),
    {
      name: 'mospoly-rasp-settings',
    }
  )
);
