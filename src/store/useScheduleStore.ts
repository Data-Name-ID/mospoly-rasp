import { create } from 'zustand';
import type { ScheduleResponse } from '../api/types';
import { fetchSchedule } from '../api/fetchSchedule';

interface ScheduleState {
  data: ScheduleResponse | null;
  loading: boolean;
  error: string | null;
  lastFetchedGroup: string | null;
  fetch: (group: string, force?: boolean) => Promise<void>;
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  data: null,
  loading: false,
  error: null,
  lastFetchedGroup: null,

  fetch: async (group: string, force = false) => {
    if (!group.trim()) return;
    if (!force && get().lastFetchedGroup === group && get().data) return;

    set({ loading: true, error: null });
    try {
      const data = await fetchSchedule(group);
      set({ data, loading: false, lastFetchedGroup: group });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Неизвестная ошибка',
        loading: false,
      });
    }
  },
}));
