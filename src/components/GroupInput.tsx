import { useState, useCallback, useEffect } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useScheduleStore } from '../store/useScheduleStore';

export function GroupInput() {
  const group = useSettingsStore((s) => s.group);
  const setGroup = useSettingsStore((s) => s.setGroup);
  const fetchData = useScheduleStore((s) => s.fetch);
  const loading = useScheduleStore((s) => s.loading);

  const [inputValue, setInputValue] = useState(group);

  useEffect(() => {
    setInputValue(group);
  }, [group]);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed) {
        setGroup(trimmed);
        fetchData(trimmed, true);
      }
    },
    [inputValue, setGroup, fetchData]
  );

  // Auto-load on mount if group is saved
  useEffect(() => {
    if (group) {
      fetchData(group);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Группа"
          className="
            h-9 w-28 sm:w-36 px-3 text-sm rounded-lg
            bg-slate-100 dark:bg-slate-800
            border border-slate-200 dark:border-slate-700
            text-slate-900 dark:text-slate-100
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
            transition-all duration-200
          "
        />
        {loading && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={loading || !inputValue.trim()}
        className="
          h-9 px-3 sm:px-4 text-sm font-medium rounded-lg
          bg-primary-500 hover:bg-primary-600 text-white
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
        "
      >
        Найти
      </button>
    </form>
  );
}
