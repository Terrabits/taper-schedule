import CalendarDate from './calendar-date';


export function getSchedule(start, dose_mg) {
  // take at bedtime
  let dose1 = new CalendarDate(start);
  dose1.setBedtime();

  // take for one week
  let events = [];
  for (let i = 0; i < 7; i++) {
    events.push({
      'id':     i,
      'title': `Medication ${dose_mg} mg`,
      'start': dose1.daysLater(i).toCalendarTime()
    });
  }
  return events;
}
