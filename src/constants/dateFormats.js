import moment from 'moment';
// dateFormats.js 
export const DATE_DISPLAY_FORMAT = 'DD/MM/YYYY';
export const DATE_DISPLAY_FORMAT_HOURS = 'hh:mm - DD/MM/YYYY';
export const DATE_DISPLAY_FORMAT_HOURS_SECONDS = 'hh:mm:ss - DD/MM/YYYY';
export const DATE_HOURS_SECONDS = 'hh:mm:ss';

// Chuyển đổi đối tượng Moment thành số năm
export const getYearFromMoment = (momentObj) => {
  if (momentObj && moment.isMoment(momentObj)) {
    return momentObj.year();
  }
  return 0;
}

// Chuyển đổi số năm thành đối tượng Moment
export const getMomentFromYear = (year) => {
  if (year && typeof year === 'number' && year !== 0) {
    return moment({ year: year });
  }
  return null;
}