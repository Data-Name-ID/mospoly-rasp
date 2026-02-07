export interface Teacher {
  id: number;
  name: string;
}

export interface Auditory {
  title: string;
  color: string;
}

export interface Lesson {
  sbj: string;
  teacher: string;
  teachers: Teacher[];
  dts: string;
  df: string;
  dt: string;
  auditories: Auditory[];
  shortRooms: string[];
  location: string;
  type: string;
  week: string;
  align: string;
  e_link: string | null;
}

export interface GroupInfo {
  title: string;
  course: number;
  dateFrom: string;
  dateTo: string;
  evening: number;
  comment: string;
}

export type DayGrid = Record<string, Lesson[]>;
export type ScheduleGrid = Record<string, DayGrid>;

export interface ScheduleResponse {
  status: string;
  grid: ScheduleGrid;
  group: GroupInfo;
  isSession: boolean;
}

export interface ParsedLesson extends Lesson {
  dayNumber: number;
  slotNumber: number;
  isOnline: boolean;
  links: ParsedLink[];
}

export interface ParsedLink {
  href: string;
  text: string;
}

export type LessonType = 'Лекция' | 'Практика' | 'Лаб. работа' | 'Практика эор';
export type ViewMode = 'today' | 'week';
export type FormatFilter = 'online' | 'offline' | 'all';
