import type { ParsedLesson } from '../api/types';
import { LESSON_TYPE_BADGE, LESSON_TYPE_ACCENT } from '../utils/constants';
import { getTimeSlot } from '../utils/timeSlots';
import { stripHtml } from '../utils/parseSchedule';

interface LessonCardProps {
  lesson: ParsedLesson;
  isCurrent?: boolean;
  showTime?: boolean;
  compact?: boolean;
}

export function LessonCard({ lesson, isCurrent, showTime = true, compact = false }: LessonCardProps) {
  const slot = getTimeSlot(lesson.slotNumber);
  const badgeClass = LESSON_TYPE_BADGE[lesson.type] || 'bg-slate-500 text-white';
  const accentClass = LESSON_TYPE_ACCENT[lesson.type] || 'border-l-slate-400';

  return (
    <div
      className={`
        lesson-card
        bg-white dark:bg-slate-800 rounded-xl border-l-4 ${accentClass}
        shadow-sm hover:shadow-md transition-all duration-200
        ${isCurrent ? 'current-lesson ring-2 ring-primary-400/50' : 'border border-slate-100 dark:border-slate-700'}
        ${compact ? 'p-2.5' : 'p-4'}
      `}
    >
      {/* Header: time + type badge */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          {showTime && slot && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                {slot.start}–{slot.end}
              </span>
              <span className="text-xs text-slate-300 dark:text-slate-600">
                {lesson.slotNumber}-я пара
              </span>
              {isCurrent && (
                <span className="text-xs font-medium text-primary-500 animate-pulse">
                  Сейчас
                </span>
              )}
            </div>
          )}
          <h3 className={`font-semibold text-slate-900 dark:text-slate-100 ${compact ? 'text-sm' : 'text-base'} leading-snug`}>
            {lesson.sbj}
          </h3>
        </div>
        <span className={`${badgeClass} text-xs font-medium px-2 py-0.5 rounded-full shrink-0`}>
          {lesson.type}
        </span>
      </div>

      {/* Details */}
      <div className={`flex flex-col gap-1.5 ${compact ? 'text-xs' : 'text-sm'} text-slate-500 dark:text-slate-400`}>
        {/* Format + Location */}
        <div className="flex items-center gap-2 flex-wrap">
          {lesson.isOnline ? (
            <span className="inline-flex items-center gap-1 text-online font-medium">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Онлайн
            </span>
          ) : (
            <span className="inline-flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Очно
            </span>
          )}

          {lesson.shortRooms.length > 0 && (
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {lesson.shortRooms.map((r) => stripHtml(r)).join(', ')}
            </span>
          )}

          {lesson.location && !lesson.isOnline && (
            <span className="text-slate-400 dark:text-slate-500">
              {lesson.location}
            </span>
          )}
        </div>

        {/* Teachers */}
        {lesson.teachers.length > 0 && (
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="truncate">
              {lesson.teachers.map((t) => t.name.trim()).join(', ')}
            </span>
          </div>
        )}

        {/* Links */}
        {lesson.links.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mt-1">
            {lesson.links.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium
                  bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400
                  hover:bg-primary-100 dark:hover:bg-primary-900/50
                  transition-colors duration-200
                "
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {link.text || 'Ссылка'}
              </a>
            ))}
          </div>
        )}

        {/* Date range */}
        {!compact && (
          <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {lesson.dts}
          </div>
        )}
      </div>
    </div>
  );
}
