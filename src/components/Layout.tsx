import { useState, type ReactNode } from 'react';
import { GroupInput } from './GroupInput';
import { ViewToggle } from './ViewToggle';
import { FilterDrawer } from './FilterDrawer';
import { useScheduleStore } from '../store/useScheduleStore';
import { useSettingsStore } from '../store/useSettingsStore';

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const data = useScheduleStore((s) => s.data);
  const error = useScheduleStore((s) => s.error);
  const stale = useScheduleStore((s) => s.stale);
  const cachedAt = useScheduleStore((s) => s.cachedAt);
  const viewMode = useSettingsStore((s) => s.viewMode);
  const filters = useSettingsStore((s) => s.filters);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const isWide = viewMode === 'week' && !!data;
  const hasActiveFilters =
    filters.types.length > 0 ||
    filters.format !== 'all' ||
    filters.showAllDates;

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="px-3 sm:px-5 py-2.5">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {/* Left: Logo + Group input */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <h1 className="text-lg font-bold text-primary-600 dark:text-primary-400 whitespace-nowrap shrink-0 flex items-center gap-1.5">
                <span className="hidden sm:inline">Расписание</span>
              </h1>
              <GroupInput />
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {data && <ViewToggle />}
              <button
                onClick={() => setSettingsOpen(true)}
                className="
                  relative h-9 px-2.5 sm:px-3 rounded-lg text-sm font-medium
                  flex items-center gap-1.5
                  bg-slate-100 dark:bg-slate-800
                  text-slate-600 dark:text-slate-300
                  hover:bg-slate-200 dark:hover:bg-slate-700
                  transition-colors duration-200
                "
                title="Настройки"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {hasActiveFilters && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary-500 rounded-full border-2 border-white dark:border-slate-900" />
                )}
              </button>
            </div>
          </div>

          {/* Group info bar */}
          {data && (
            <div className="flex items-center gap-2 sm:gap-3 mt-1.5 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {data.group.title}
              </span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span>{data.group.course} курс</span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span>{formatDate(data.group.dateFrom)} — {formatDate(data.group.dateTo)}</span>
              {data.isSession && (
                <>
                  <span className="text-slate-300 dark:text-slate-600">·</span>
                  <span className="text-amber-500 font-medium">Сессия</span>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Error */}
      {error && !stale && (
        <div className="max-w-2xl mx-auto px-4 mt-4">
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
            <span className="font-medium">Ошибка: </span>{error}
          </div>
        </div>
      )}

      {/* Stale cache banner */}
      {stale && (
        <div className="max-w-2xl mx-auto px-4 mt-4">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-sm flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              <span className="font-medium">Сервер недоступен.</span>{' '}
              Показано кешированное расписание
              {cachedAt && (
                <> от {new Date(cachedAt).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</>
              )}
            </span>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className={`py-4 sm:py-6 ${isWide ? 'px-2 sm:px-5' : 'max-w-2xl mx-auto px-4'}`}>
        {children}
      </main>

      {/* Settings Drawer */}
      <FilterDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
