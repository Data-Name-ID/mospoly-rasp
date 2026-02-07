export interface TimeSlot {
  number: number;
  start: string;
  end: string;
  startMinutes: number;
  endMinutes: number;
}

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export const TIME_SLOTS: TimeSlot[] = [
  { number: 1, start: '09:00', end: '10:30', startMinutes: toMinutes('09:00'), endMinutes: toMinutes('10:30') },
  { number: 2, start: '10:40', end: '12:10', startMinutes: toMinutes('10:40'), endMinutes: toMinutes('12:10') },
  { number: 3, start: '12:20', end: '13:50', startMinutes: toMinutes('12:20'), endMinutes: toMinutes('13:50') },
  { number: 4, start: '14:30', end: '16:00', startMinutes: toMinutes('14:30'), endMinutes: toMinutes('16:00') },
  { number: 5, start: '16:10', end: '17:40', startMinutes: toMinutes('16:10'), endMinutes: toMinutes('17:40') },
  { number: 6, start: '17:50', end: '19:20', startMinutes: toMinutes('17:50'), endMinutes: toMinutes('19:20') },
  { number: 7, start: '19:30', end: '21:00', startMinutes: toMinutes('19:30'), endMinutes: toMinutes('21:00') },
];

export function getTimeSlot(slotNumber: number): TimeSlot | undefined {
  return TIME_SLOTS.find((s) => s.number === slotNumber);
}

export function getCurrentSlotStatus(): {
  currentSlot: number | null;
  nextSlot: number | null;
  minutesUntilNext: number | null;
} {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let currentSlot: number | null = null;
  let nextSlot: number | null = null;
  let minutesUntilNext: number | null = null;

  for (const slot of TIME_SLOTS) {
    if (currentMinutes >= slot.startMinutes && currentMinutes <= slot.endMinutes) {
      currentSlot = slot.number;
    }
    if (currentMinutes < slot.startMinutes) {
      if (nextSlot === null) {
        nextSlot = slot.number;
        minutesUntilNext = slot.startMinutes - currentMinutes;
      }
    }
  }

  return { currentSlot, nextSlot, minutesUntilNext };
}
