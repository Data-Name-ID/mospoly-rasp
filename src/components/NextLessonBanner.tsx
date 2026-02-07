import { useEffect, useState } from 'react';
import type { ParsedLesson } from '../api/types';
import { getCurrentSlotStatus, getTimeSlot } from '../utils/timeSlots';

interface NextLessonBannerProps {
  lessons: ParsedLesson[];
}

export function NextLessonBanner({ lessons }: NextLessonBannerProps) {
  const [status, setStatus] = useState(getCurrentSlotStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getCurrentSlotStatus());
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  if (status.currentSlot) {
    const currentLesson = lessons.find((l) => l.slotNumber === status.currentSlot);
    if (currentLesson) {
      const slot = getTimeSlot(currentLesson.slotNumber);
      return (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
          <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
          <div className="text-sm">
            <span className="font-medium text-primary-700 dark:text-primary-300">Сейчас идёт: </span>
            <span className="text-primary-600 dark:text-primary-400">{currentLesson.sbj}</span>
            {slot && (
              <span className="text-primary-400 dark:text-primary-500 ml-1">
                (до {slot.end})
              </span>
            )}
          </div>
        </div>
      );
    }
  }

  if (status.nextSlot && status.minutesUntilNext !== null) {
    const nextLesson = lessons.find((l) => l.slotNumber === status.nextSlot);
    if (nextLesson) {
      const hours = Math.floor(status.minutesUntilNext / 60);
      const mins = status.minutesUntilNext % 60;
      const timeStr = hours > 0 ? `${hours}ч ${mins}мин` : `${mins} мин`;

      return (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <div className="text-sm">
            <span className="font-medium text-slate-600 dark:text-slate-300">Следующая пара через {timeStr}: </span>
            <span className="text-slate-500 dark:text-slate-400">{nextLesson.sbj}</span>
          </div>
        </div>
      );
    }
  }

  return null;
}
