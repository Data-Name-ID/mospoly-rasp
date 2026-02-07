import { useMemo, useRef, useLayoutEffect } from 'react';
import { useFilteredLessons } from '../hooks/useFilteredLessons';
import { useScheduleStore } from '../store/useScheduleStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { getTodayDayNumber, getTodayISO, DAY_NAMES, DAY_NAMES_SHORT } from '../utils/constants';
import { TIME_SLOTS } from '../utils/timeSlots';
import { LESSON_TYPE_BADGE, LESSON_TYPE_ACCENT } from '../utils/constants';
import { stripHtml, parseScheduleGrid } from '../utils/parseSchedule';
import { EmptyState } from './EmptyState';
import { getCurrentSlotStatus } from '../utils/timeSlots';
import type { ParsedLesson } from '../api/types';

function WeekLessonCard({ lesson, isCurrent }: { lesson: ParsedLesson; isCurrent: boolean }) {
  const badgeClass = LESSON_TYPE_BADGE[lesson.type] || 'bg-slate-500 text-white';
  const accentClass = LESSON_TYPE_ACCENT[lesson.type] || 'border-l-slate-400';

  return (
    <div
      className={`
        flex-1 rounded-lg border-l-[3px] ${accentClass} px-2.5 py-2
        bg-white dark:bg-slate-800
        ${isCurrent ? 'ring-2 ring-primary-400/50 shadow-md' : 'shadow-sm border border-slate-100 dark:border-slate-700/50'}
        transition-all duration-200 hover:shadow-md
        flex flex-col
      `}
    >
      <div className="flex items-start justify-between gap-1.5 mb-1">
        <h4 className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 leading-tight line-clamp-2">
          {lesson.sbj}
        </h4>
        <span className={`${badgeClass} text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0 leading-none mt-0.5`}>
          {lesson.type === 'Лаб. работа' ? 'Лаб' : lesson.type}
        </span>
      </div>

      <div className="space-y-0.5 text-[11px] text-slate-500 dark:text-slate-400 mt-auto">
        {lesson.isOnline ? (
          <div className="text-online font-medium">Онлайн</div>
        ) : lesson.shortRooms.length > 0 ? (
          <div className="font-medium text-slate-700 dark:text-slate-300">
            {lesson.shortRooms.map((r) => stripHtml(r)).join(', ')}
          </div>
        ) : null}

        {lesson.teachers.length > 0 && (
          <div className="truncate text-slate-400 dark:text-slate-500">
            {lesson.teachers.map((t) => {
              const parts = t.name.trim().split(' ');
              return parts.length >= 2 ? `${parts[0]} ${parts[1][0]}.` : parts[0];
            }).join(', ')}
          </div>
        )}

        {lesson.links.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {lesson.links.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:text-primary-400 underline underline-offset-2 text-[10px]"
              >
                {link.text || 'Ссылка'}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function WeekView() {
  const allLessons = useFilteredLessons();
  const data = useScheduleStore((s) => s.data);
  const showAllDates = useSettingsStore((s) => s.filters.showAllDates);
  const todayNum = getTodayDayNumber();
  const slotStatus = getCurrentSlotStatus();
  const tableRef = useRef<HTMLTableElement>(null);

  // Days & slots from unfiltered schedule (so columns never disappear when filtering)
  const unfilteredLessons = useMemo(() => {
    if (!data) return [];
    return parseScheduleGrid(data.grid, showAllDates ? undefined : getTodayISO());
  }, [data, showAllDates]);

  const activeDays = useMemo(() => {
    const days = new Set<number>();
    for (const lesson of unfilteredLessons) {
      days.add(lesson.dayNumber);
    }
    return [1, 2, 3, 4, 5, 6].filter((d) => days.has(d));
  }, [unfilteredLessons]);

  const activeSlots = useMemo(() => {
    const slots = new Set<number>();
    for (const lesson of unfilteredLessons) {
      slots.add(lesson.slotNumber);
    }
    return TIME_SLOTS.filter((s) => slots.has(s.number));
  }, [unfilteredLessons]);

  const grid = useMemo(() => {
    const g: Record<number, Record<number, ParsedLesson[]>> = {};
    for (let d = 1; d <= 6; d++) {
      g[d] = {};
      for (const slot of TIME_SLOTS) {
        g[d][slot.number] = [];
      }
    }
    for (const lesson of allLessons) {
      if (g[lesson.dayNumber]?.[lesson.slotNumber]) {
        g[lesson.dayNumber][lesson.slotNumber].push(lesson);
      }
    }
    return g;
  }, [allLessons]);

  // Equalize all row heights to the tallest row
  useLayoutEffect(() => {
    if (!tableRef.current) return;
    const rows = tableRef.current.querySelectorAll<HTMLElement>('tbody tr');
    // Reset first
    rows.forEach((row) => {
      row.style.height = '';
    });
    // Measure
    let maxH = 0;
    rows.forEach((row) => {
      maxH = Math.max(maxH, row.offsetHeight);
    });
    // Apply
    if (maxH > 0) {
      rows.forEach((row) => {
        row.style.height = `${maxH}px`;
      });
    }
  }, [allLessons, unfilteredLessons, activeSlots, activeDays]);

  if (allLessons.length === 0) {
    return (
      <EmptyState
        icon="empty"
        title="Расписание пусто"
        description="Нет пар для отображения. Попробуйте изменить фильтры или включить все даты."
      />
    );
  }

  return (
    <div className="overflow-x-auto pb-2 -mx-2 sm:-mx-5 px-2 sm:px-5 scrollbar-hide">
      <table
        ref={tableRef}
        className="w-full border-collapse"
        style={{ tableLayout: 'fixed', minWidth: `${activeDays.length * 170 + 56}px` }}
      >
        <colgroup>
          <col style={{ width: '52px' }} />
          {activeDays.map((day) => (
            <col key={day} />
          ))}
        </colgroup>

        <thead>
          <tr>
            <th className="pb-1.5" />
            {activeDays.map((day) => (
              <th key={day} className="pb-1.5 px-[3px]">
                <div className={`
                  py-1.5 rounded-lg text-center text-sm font-semibold
                  ${day === todayNum
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }
                `}>
                  <span className="hidden md:inline">{DAY_NAMES[day]}</span>
                  <span className="md:hidden">{DAY_NAMES_SHORT[day]}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {activeSlots.map((slot) => (
            <tr key={slot.number}>
              <td className="pr-1 py-[3px] align-top">
                <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono leading-tight pt-2 text-right">
                  <div className="font-medium">{slot.start}</div>
                  <div className="text-slate-300 dark:text-slate-600">{slot.end}</div>
                </div>
              </td>

              {activeDays.map((day) => {
                const cellLessons = grid[day]?.[slot.number] || [];
                const isCurrent = day === todayNum && slotStatus.currentSlot === slot.number;

                return (
                  <td key={day} className="px-[3px] py-[3px]" style={{ height: '1px' }}>
                    <div className="h-full flex flex-col gap-1">
                      {cellLessons.length > 0 ? (
                        cellLessons.map((lesson, i) => (
                          <WeekLessonCard
                            key={`${lesson.sbj}-${i}`}
                            lesson={lesson}
                            isCurrent={isCurrent}
                          />
                        ))
                      ) : (
                        <div className="flex-1 rounded-lg bg-slate-50/30 dark:bg-slate-800/20" />
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
