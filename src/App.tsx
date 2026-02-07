import { useTheme } from './hooks/useTheme';
import { useSettingsStore } from './store/useSettingsStore';
import { useScheduleStore } from './store/useScheduleStore';
import { Layout } from './components/Layout';
import { DayView } from './components/DayView';
import { WeekView } from './components/WeekView';
import { EmptyState } from './components/EmptyState';

function App() {
  useTheme();

  const viewMode = useSettingsStore((s) => s.viewMode);
  const group = useSettingsStore((s) => s.group);
  const data = useScheduleStore((s) => s.data);
  const loading = useScheduleStore((s) => s.loading);

  return (
    <Layout>
      {!group && !data && !loading && (
        <EmptyState
          icon="graduation"
          title="Введите номер группы"
          description="Укажите номер учебной группы в поле выше, чтобы загрузить расписание"
        />
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-[3px] border-primary-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Загрузка расписания...
            </span>
          </div>
        </div>
      )}

      {data && !loading && (
        viewMode === 'today' ? <DayView /> : <WeekView />
      )}
    </Layout>
  );
}

export default App;
