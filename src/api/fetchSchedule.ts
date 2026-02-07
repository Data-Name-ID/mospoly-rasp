import type { ScheduleResponse } from './types';

const CACHE_PREFIX = 'schedule_cache_';
const CACHE_TS_PREFIX = 'schedule_ts_';

function getCached(group: string): { data: ScheduleResponse; timestamp: number } | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + group);
    const ts = localStorage.getItem(CACHE_TS_PREFIX + group);
    if (raw && ts) {
      return { data: JSON.parse(raw), timestamp: Number(ts) };
    }
  } catch { /* ignore */ }
  return null;
}

function setCache(group: string, data: ScheduleResponse) {
  try {
    localStorage.setItem(CACHE_PREFIX + group, JSON.stringify(data));
    localStorage.setItem(CACHE_TS_PREFIX + group, String(Date.now()));
  } catch { /* quota exceeded — ignore */ }
}

export interface FetchResult {
  data: ScheduleResponse;
  stale: boolean;
  cachedAt?: number;
}

export async function fetchSchedule(group: string): Promise<FetchResult> {
  const params = new URLSearchParams({ group, session: '0' });

  try {
    const response = await fetch(`/api/schedule?${params}`);

    if (!response.ok) {
      throw new Error(`Ошибка загрузки: ${response.status}`);
    }

    const data: ScheduleResponse = await response.json();

    if (data.status !== 'ok') {
      throw new Error('Группа не найдена или сервер вернул ошибку');
    }

    // Save successful response to localStorage
    setCache(group, data);

    return { data, stale: false };
  } catch (err) {
    // Try to serve from localStorage cache
    const cached = getCached(group);
    if (cached) {
      return { data: cached.data, stale: true, cachedAt: cached.timestamp };
    }

    // No cache available — rethrow
    throw err;
  }
}
