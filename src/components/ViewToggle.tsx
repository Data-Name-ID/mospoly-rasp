import type { ReactNode } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import type { ViewMode } from '../api/types';

const views: { value: ViewMode; label: string; icon: ReactNode }[] = [
  {
    value: 'today',
    label: 'Сегодня',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    value: 'week',
    label: 'Неделя',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
];

export function ViewToggle() {
  const viewMode = useSettingsStore((s) => s.viewMode);
  const setViewMode = useSettingsStore((s) => s.setViewMode);

  return (
    <div className="flex items-center h-9 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 gap-0.5">
      {views.map((v) => (
        <button
          key={v.value}
          onClick={() => setViewMode(v.value)}
          className={`
            h-full flex items-center gap-1.5 px-2.5 rounded-md text-sm font-medium transition-all duration-200
            ${
              viewMode === v.value
                ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600 dark:text-primary-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }
          `}
        >
          {v.icon}
          <span className="hidden sm:inline">{v.label}</span>
        </button>
      ))}
    </div>
  );
}
