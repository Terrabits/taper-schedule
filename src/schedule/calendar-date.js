export default class CalendarDate {
  constructor(date) {
    this.date = new Date(date);
  }

  setWakeup() {
    // 7:30 am
    this.clearTime();
    this.date.setHours(7);
    this.date.setMinutes(30);
  }

  setMorning() {
    // 9:00 am
    this.clearTime();
    this.date.setHours(9);
  }

  setNoon() {
    // 12:00 pm
    this.clearTime();
    this.date.setHours(12);
  }

  setEvening() {
    // 6:00 pm [18:00]
    this.clearTime();
    this.date.setHours(18);
  }

  setBedtime() {
    this.clearTime();
    this.date.setHours(21);
  }

  toTimeSinceEpoch() {
    return this.date.getTime();
  }

  toCalendarTime() {
    return this.date.toISOString();
  }

  daysLater(days) {
    let day  = this.date.getDate() + days;
    let date = this.copy();
    date.date.setDate(day);
    return date;
  }

  // helpers

  clearTime() {
    this.date.setHours(0);
    this.date.setMinutes(0);
    this.date.setSeconds(0);
    this.date.setMilliseconds(0);
  }

  copy() {
    return new CalendarDate(this.date);
  }
}
