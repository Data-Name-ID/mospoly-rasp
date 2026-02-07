import { useMemo, useState, useEffect } from 'react';
import { useFilteredLessons } from '../hooks/useFilteredLessons';
import { getTodayDayNumber, DAY_NAMES } from '../utils/constants';
import { getCurrentSlotStatus } from '../utils/timeSlots';
import { LessonCard } from './LessonCard';
import { NextLessonBanner } from './NextLessonBanner';
import { EmptyState } from './EmptyState';

export function DayView() {
  const allLessons = useFilteredLessons();
  const todayNum = getTodayDayNumber();
  const [selectedDay, setSelectedDay] = useState(todayNum > 6 ? 1 : todayNum);
  const [slotStatus, setSlotStatus] = useState(getCurrentSlotStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setSlotStatus(getCurrentSlotStatus());
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  const dayLessons = useMemo(
    () => allLessons.filter((l) => l.dayNumber === selectedDay),
    [allLessons, selectedDay]
  );

  const daysWithLessons = useMemo(() => {
    const days = new Set(allLessons.map((l) => l.dayNumber));
    return [1, 2, 3, 4, 5, 6].filter((d) => days.has(d));
  }, [allLessons]);

  const isToday = selectedDay === todayNum;

  return (
    <div className="space-y-4">
      {/* Day selector */}
      <div className="flex gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-hide">
        {[1, 2, 3, 4, 5, 6].map((day) => {
          const hasLessons = daysWithLessons.includes(day);
          const isSelected = day === selectedDay;
          const isCurrentDay = day === todayNum;
          const dayNames: Record<number, string> = { 1: 'Пн', 2: 'Вт', 3: 'Ср', 4: 'Чт', 5: 'Пт', 6: 'Сб' };

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`
                relative flex flex-col items-center min-w-[3rem] px-3 py-2 rounded-lg text-sm font-medium
                transition-all duration-200
                ${isSelected
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25'
                  : hasLessons
                    ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                    : 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 border border-transparent'
                }
              `}
            >
              <span>{dayNames[day]}</span>
              {isCurrentDay && !isSelected && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Day title */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
          {DAY_NAMES[selectedDay]}
          {isToday && (
            <span className="ml-2 text-sm font-normal text-primary-500">сегодня</span>
          )}
        </h2>
        <span className="text-sm text-slate-400 dark:text-slate-500">
          {dayLessons.length} {dayLessons.length === 1 ? 'пара' : dayLessons.length < 5 ? 'пары' : 'пар'}
        </span>
      </div>

      {/* Next lesson banner */}
      {isToday && dayLessons.length > 0 && (
        <NextLessonBanner lessons={dayLessons} />
      )}

      {/* Lessons list */}
      {dayLessons.length > 0 ? (
        <div className="space-y-3">
          {dayLessons.map((lesson, i) => (
            <LessonCard
              key={`${lesson.sbj}-${lesson.slotNumber}-${i}`}
              lesson={lesson}
              isCurrent={isToday && slotStatus.currentSlot === lesson.slotNumber}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={selectedDay === 7 ? 'relax' : 'calendar'}
          title={selectedDay === 7 ? 'Воскресенье — выходной!' : 'Нет пар'}
          description={
            selectedDay === 7
              ? 'Отдыхай!'
              : 'В этот день нет занятий по текущему расписанию'
          }
        />
      )}
    </div>
  );
}
