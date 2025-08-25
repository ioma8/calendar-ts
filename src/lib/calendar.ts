// Czech month and day names, calendar utilities
export const CZECH_MONTHS = [
  "Leden",
  "Únor", 
  "Březen",
  "Duben",
  "Květen",
  "Červen",
  "Červenec",
  "Srpen",
  "Září",
  "Říjen",
  "Listopad",
  "Prosinec",
];

export const CZECH_DAYNAMES = [
  "Pondělí", 
  "Úterý", 
  "Středa", 
  "Čtvrtek", 
  "Pátek", 
  "Sobota", 
  "Neděle"
];

export interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  isPadding: boolean;
}

export interface CalendarWeek {
  days: CalendarDay[];
}

export interface CalendarData {
  month: number;
  year: number;
  monthName: string;
  weeks: CalendarWeek[];
}

export function generateCalendarData(year: number, month: number): CalendarData {
  const monthName = CZECH_MONTHS[month - 1];
  
  // Get the first day of the month and number of days
  const firstDate = new Date(year, month - 1, 1);
  const lastDate = new Date(year, month, 0);
  const daysInMonth = lastDate.getDate();
  
  // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
  // Convert to our format (0 = Monday, 1 = Tuesday, etc.)
  let firstDayOfWeek = firstDate.getDay();
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  
  const weeks: CalendarWeek[] = [];
  let currentWeek: CalendarDay[] = [];
  
  // Add padding days at the beginning
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push({
      day: 0,
      isCurrentMonth: false,
      isPadding: true
    });
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push({
      day,
      isCurrentMonth: true,
      isPadding: false
    });
    
    // If we completed a week, add it to weeks array
    if (currentWeek.length === 7) {
      weeks.push({ days: [...currentWeek] });
      currentWeek = [];
    }
  }
  
  // Add padding days at the end if needed
  while (currentWeek.length > 0 && currentWeek.length < 7) {
    currentWeek.push({
      day: 0,
      isCurrentMonth: false,
      isPadding: true
    });
  }
  
  // Add the last week if it has any days
  if (currentWeek.length === 7) {
    weeks.push({ days: currentWeek });
  }
  
  return {
    month,
    year,
    monthName,
    weeks
  };
}

export function isWeekend(dayIndex: number): boolean {
  // Saturday = 5, Sunday = 6 (0-indexed from Monday)
  return dayIndex === 5 || dayIndex === 6;
}
