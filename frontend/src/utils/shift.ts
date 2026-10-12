export interface ShiftInfo {
  name: string;
  timeRange: string;
  label: string;
  icon: string;
  startTime: string;
  endTime: string;
  description: string;
}

export const SHIFTS: ShiftInfo[] = [
  {
    name: 'Morning Shift',
    timeRange: '04:00 - 12:00',
    label: 'Morning Shift (04:00 - 12:00)',
    icon: '🌅',
    startTime: '04:00',
    endTime: '12:00',
    description: '04:00 AM – 12:00 PM',
  },
  {
    name: 'Afternoon Shift',
    timeRange: '12:00 - 20:00',
    label: 'Afternoon Shift (12:00 - 20:00)',
    icon: '☀️',
    startTime: '12:00',
    endTime: '20:00',
    description: '12:00 PM – 08:00 PM',
  },
  {
    name: 'Night Shift',
    timeRange: '20:00 - 04:00',
    label: 'Night Shift (20:00 - 04:00)',
    icon: '🌙',
    startTime: '20:00',
    endTime: '04:00',
    description: '08:00 PM – 04:00 AM',
  },
];

/**
 * Calculates current active shift based on the provided date/time.
 * Accurately handles crossing midnight (20:00 to 04:00).
 */
export function getCurrentShift(date: Date = new Date()): ShiftInfo {
  const hours = date.getHours(); // 0 - 23

  // Morning Shift: 04:00 to 11:59 (04:00 AM - 12:00 PM)
  if (hours >= 4 && hours < 12) {
    return SHIFTS[0];
  }

  // Afternoon Shift: 12:00 to 19:59 (12:00 PM - 08:00 PM)
  if (hours >= 12 && hours < 20) {
    return SHIFTS[1];
  }

  // Night Shift: 20:00 to 03:59 (08:00 PM - 04:00 AM) - crosses midnight
  return SHIFTS[2];
}
