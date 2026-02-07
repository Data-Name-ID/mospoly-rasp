export const DAY_NAMES: Record<number, string> = {
  1: 'Понедельник',
  2: 'Вторник',
  3: 'Среда',
  4: 'Четверг',
  5: 'Пятница',
  6: 'Суббота',
};

export const DAY_NAMES_SHORT: Record<number, string> = {
  1: 'Пн',
  2: 'Вт',
  3: 'Ср',
  4: 'Чт',
  5: 'Пт',
  6: 'Сб',
};

export const LESSON_TYPE_COLORS: Record<string, string> = {
  'Лекция': 'bg-lecture/10 border-lecture text-lecture dark:bg-lecture/20',
  'Практика': 'bg-practice/10 border-practice text-practice dark:bg-practice/20',
  'Лаб. работа': 'bg-lab/10 border-lab text-lab dark:bg-lab/20',
};

export const LESSON_TYPE_BADGE: Record<string, string> = {
  'Лекция': 'bg-lecture text-white',
  'Практика': 'bg-practice text-white',
  'Лаб. работа': 'bg-lab text-white',
};

export const LESSON_TYPE_ACCENT: Record<string, string> = {
  'Лекция': 'border-l-lecture',
  'Практика': 'border-l-practice',
  'Лаб. работа': 'border-l-lab',
};

/**
 * Returns the day of week as 1=Mon..7=Sun using JS getDay() which returns 0=Sun..6=Sat
 */
export function getTodayDayNumber(): number {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 7 : jsDay;
}

export function getTodayISO(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
