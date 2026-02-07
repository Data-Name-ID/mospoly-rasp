import { useMemo } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useScheduleStore } from '../store/useScheduleStore';
import { parseScheduleGrid, getUniqueTypes } from '../utils/parseSchedule';
import { getTodayISO } from '../utils/constants';

export function Filters() {
  const data = useScheduleStore((s) => s.data);
  const filters = useSettingsStore((s) => s.filters);
  const setFilters = useSettingsStore((s) => s.setFilters);
  const resetFilters = useSettingsStore((s) => s.resetFilters);
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);

  const allLessons = useMemo(() => {
    if (!data) return [];
    return parseScheduleGrid(data.grid);
  }, [data]);

  const activeLessons = useMemo(() => {
    if (!data) return [];
    return parseScheduleGrid(data.grid, getTodayISO());
  }, [data]);

  const types = useMemo(() => getUniqueTypes(allLessons), [allLessons]);

  const hasActiveFilters =
    filters.types.length > 0 ||
    filters.format !== 'all' ||
    filters.showAllDates;

  const activeCount = activeLessons.length;
  const totalCount = allLessons.length;

  const toggleType = (value: string) => {
    const current = filters.types;
    if (current.includes(value)) {
      setFilters({ types: current.filter((v) => v !== value) });
    } else {
      setFilters({ types: [...current, value] });
    }
  };

  return (
    <div className="space-y-6">
      {/* Theme */}
      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2.5 uppercase tracking-wider">
          Тема оформления
        </p>
        <div className="flex gap-2">
          {([
            { value: 'light' as const, icon: (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )},
            { value: 'dark' as const, icon: (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )},
            { value: 'system' as const, icon: (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            )},
          ] as const).map((t) => (
            <button
              key={t.value}
              onClick={() => setTheme(t.value)}
              className={`
                flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                border transition-all duration-200
                ${theme === t.value
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-500'
                }
              `}
            >
              {t.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Separator */}
      {data && <div className="border-t border-slate-200 dark:border-slate-800" />}

      {data && (
        <>
          {/* Reset button */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="
                w-full py-2 rounded-lg text-sm font-medium
                text-red-500 hover:text-red-600 dark:text-red-400
                bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20
                transition-colors
              "
            >
              Сбросить фильтры
            </button>
          )}

          {/* Show all dates toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Показать все даты
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {activeCount} из {totalCount} пар
              </div>
            </div>
            <button
              onClick={() => setFilters({ showAllDates: !filters.showAllDates })}
              className={`
                relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0
                ${filters.showAllDates ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-600'}
              `}
            >
              <span
                className={`
                  absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm
                  transition-transform duration-200
                  ${filters.showAllDates ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>

          {/* Type filter */}
          {types.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2.5 uppercase tracking-wider">
                Тип занятия
              </p>
              <div className="flex flex-wrap gap-2">
                {types.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`filter-chip ${filters.types.includes(type) ? 'active' : ''}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Format filter */}
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2.5 uppercase tracking-wider">
              Формат
            </p>
            <div className="flex flex-wrap gap-2">
              {([
                { value: 'all' as const, label: 'Все', icon: null },
                { value: 'online' as const, label: 'Онлайн', icon: (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                )},
                { value: 'offline' as const, label: 'Очно', icon: (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )},
              ] as const).map((fmt) => (
                <button
                  key={fmt.value}
                  onClick={() => setFilters({ format: fmt.value })}
                  className={`filter-chip ${filters.format === fmt.value ? 'active' : ''}`}
                >
                  {fmt.icon}
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
