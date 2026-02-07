import { useMemo } from 'react';
import { useScheduleStore } from '../store/useScheduleStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { parseScheduleGrid } from '../utils/parseSchedule';
import { getTodayISO } from '../utils/constants';
import type { ParsedLesson } from '../api/types';

export function useFilteredLessons(): ParsedLesson[] {
  const data = useScheduleStore((s) => s.data);
  const filters = useSettingsStore((s) => s.filters);

  return useMemo(() => {
    if (!data) return [];

    const dateFilter = filters.showAllDates ? undefined : getTodayISO();
    let lessons = parseScheduleGrid(data.grid, dateFilter);

    // Type filter
    if (filters.types.length > 0) {
      lessons = lessons.filter((l) => filters.types.includes(l.type));
    }

    // Format filter
    if (filters.format === 'online') {
      lessons = lessons.filter((l) => l.isOnline);
    } else if (filters.format === 'offline') {
      lessons = lessons.filter((l) => !l.isOnline);
    }

    return lessons;
  }, [data, filters]);
}
