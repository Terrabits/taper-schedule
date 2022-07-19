export function getLocalDate(dateStr) {
  // parse year, month, day
  let yearString, monthString, dayString;
  [yearString, monthString, dayString] = dateStr.split('-');

  // return new Date
  let year  = Number(yearString);
  let month = Number(monthString) - 1;  // Date month is zero-indexed
  let day   = Number(dayString);
  return new Date(year, month, day);
}
