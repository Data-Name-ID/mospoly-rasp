import type { ScheduleResponse } from './types';

export async function fetchSchedule(group: string): Promise<ScheduleResponse> {
  const params = new URLSearchParams({ group, session: '0' });
  const response = await fetch(`/api/schedule?${params}`);

  if (!response.ok) {
    throw new Error(`Ошибка загрузки расписания: ${response.status}`);
  }

  const data: ScheduleResponse = await response.json();

  if (data.status !== 'ok') {
    throw new Error('Группа не найдена или сервер вернул ошибку');
  }

  return data;
}
