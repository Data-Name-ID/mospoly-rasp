import { create } from 'zustand';
import type { ScheduleResponse } from '../api/types';
import { fetchSchedule } from '../api/fetchSchedule';

interface ScheduleState {
  data: ScheduleResponse | null;
  loading: boolean;
  error: string | null;
  /** Data served from local cache because API was unavailable */
  stale: boolean;
  cachedAt: number | null;
  lastFetchedGroup: string | null;
  fetch: (group: string, force?: boolean) => Promise<void>;
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  data: null,
  loading: false,
  error: null,
  stale: false,
  cachedAt: null,
  lastFetchedGroup: null,

  fetch: async (group: string, force = false) => {
    if (!group.trim()) return;
    if (!force && get().lastFetchedGroup === group && get().data) return;

    set({ loading: true, error: null, stale: false, cachedAt: null });
    try {
      const result = await fetchSchedule(group);
      set({
        data: result.data,
        loading: false,
        lastFetchedGroup: group,
        stale: result.stale,
        cachedAt: result.cachedAt ?? null,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Неизвестная ошибка',
        loading: false,
      });
    }
  },
}));
