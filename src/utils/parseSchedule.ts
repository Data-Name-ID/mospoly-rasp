import type { ScheduleGrid, ParsedLesson, ParsedLink, Lesson } from '../api/types';

const LINK_REGEX = /<a\s+href="([^"]+)"[^>]*>([^<]*)<\/a>/gi;

export function parseLinks(html: string): ParsedLink[] {
  const links: ParsedLink[] = [];
  let match: RegExpExecArray | null;
  const regex = new RegExp(LINK_REGEX.source, LINK_REGEX.flags);
  while ((match = regex.exec(html)) !== null) {
    links.push({ href: match[1], text: match[2].replace(/[📷🌐🚀]\s*/g, '').trim() });
  }
  return links;
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export function isOnlineLesson(lesson: Lesson): boolean {
  const loc = lesson.location.toLowerCase();
  return (
    loc.includes('webinar') ||
    loc.includes('online') ||
    loc === 'пд' ||
    lesson.auditories.some((a) => a.title.includes('href='))
  );
}

export function isLessonActive(lesson: Lesson, dateISO: string): boolean {
  return dateISO >= lesson.df && dateISO <= lesson.dt;
}

export function parseScheduleGrid(
  grid: ScheduleGrid,
  filterDate?: string
): ParsedLesson[] {
  const lessons: ParsedLesson[] = [];

  for (const [dayKey, dayGrid] of Object.entries(grid)) {
    const dayNumber = parseInt(dayKey, 10);
    for (const [slotKey, slotLessons] of Object.entries(dayGrid)) {
      const slotNumber = parseInt(slotKey, 10);
      for (const lesson of slotLessons) {
        if (filterDate && !isLessonActive(lesson, filterDate)) {
          continue;
        }

        const allLinks: ParsedLink[] = [];
        for (const aud of lesson.auditories) {
          allLinks.push(...parseLinks(aud.title));
        }

        // Normalize "Практика эор" -> "Практика"
        const normalizedType = lesson.type === 'Практика эор' ? 'Практика' : lesson.type;

        lessons.push({
          ...lesson,
          type: normalizedType,
          dayNumber,
          slotNumber,
          isOnline: isOnlineLesson(lesson),
          links: allLinks,
        });
      }
    }
  }

  return lessons.sort((a, b) => {
    if (a.dayNumber !== b.dayNumber) return a.dayNumber - b.dayNumber;
    return a.slotNumber - b.slotNumber;
  });
}

export function getUniqueSbj(lessons: ParsedLesson[]): string[] {
  return [...new Set(lessons.map((l) => l.sbj))].sort();
}

export function getUniqueTeachers(lessons: ParsedLesson[]): string[] {
  const names = new Set<string>();
  for (const l of lessons) {
    for (const t of l.teachers) {
      names.add(t.name.trim());
    }
  }
  return [...names].sort();
}

export function getUniqueTypes(lessons: ParsedLesson[]): string[] {
  return [...new Set(lessons.map((l) => l.type))].sort();
}
