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

// Chuyển đổi đối tượng Moment theo format "DD/MM/YYYY" thành chuỗi ngày
export const getDateStringFromMoment = (momentObj) => {
  if (momentObj && moment.isMoment(momentObj)) {
    return momentObj.format('DD/MM/YYYY');
  }
  return null;
}

// Chuyển đổi chuỗi ngày theo format "DD/MM/YYYY" thành đối tượng Moment
export const getMomentFromDateString = (dateString) => {
  if (dateString && typeof dateString === 'string') {
    if (moment(dateString, 'DD/MM/YYYY').isValid()) {
      return moment(dateString, 'DD/MM/YYYY');
    }
  }
  return null;
}

export const stationTypes = [
  { value : '', label: intl.formatMessage({ id: 'all_stations' })},
  { value: meta.STATION_TYPE?.EXTERNAL, label: intl.formatMessage({ id: 'external' })},
  { value: meta.STATION_TYPE?.INTERNAL, label: intl.formatMessage({ id:'internal' })},
  { value: meta.STATION_TYPE?.GARAGE, label: intl.formatMessage({ id:'garage' })},
  { value: meta.STATION_TYPE?.HELPSERVICE, label: intl.formatMessage({ id:'help_service' })},
  { value: meta.STATION_TYPE?.INSURANCE, label: intl.formatMessage({ id:'INSURANCE' })},
  { value: meta.STATION_TYPE?.CONSULTING, label: intl.formatMessage({ id:'consulting_unit' })},
  { value: meta.STATION_TYPE?.AFFILIATE, label: intl.formatMessage({ id:'AFFILIATE' })},
  { value: meta.STATION_TYPE?.ADVERTISING, label: intl.formatMessage({ id:'ADVERTISING' })},
  { value: meta.STATION_TYPE?.COOPERATIVE, label: intl.formatMessage({ id:'COOPERATIVE' })},
  { value: meta.STATION_TYPE?.USED_VEHICLES_DEALERSHIP, label: intl.formatMessage({ id:'USED_VEHICLES_DEALERSHIP' })},
  { value: meta.STATION_TYPE?.SPARE_PARTS_DEALERSHIP, label: intl.formatMessage({ id:'SPARE_PARTS_DEALERSHIP' })},
  { value: meta.STATION_TYPE?.PARKING_LOT, label: intl.formatMessage({ id:'PARKING_LOT' })},
  { value: meta.STATION_TYPE?.VEHICLE_MODIFICATION, label: intl.formatMessage({ id:'VEHICLE_MODIFICATION' })},
  { value: meta.STATION_TYPE?.DRIVING_SCHOOL, label: intl.formatMessage({ id:'DRIVING_SCHOOL' })},
  { value: meta.STATION_TYPE?.CHAUFFEUR_SERVICE, label: intl.formatMessage({ id:'CHAUFFEUR_SERVICE' })},
  { value: meta.STATION_TYPE?.PARTS_MANUFACTURING_CONSULTANCY, label: intl.formatMessage({ id:'PARTS_MANUFACTURING_CONSULTANCY' })},
  { value: meta.STATION_TYPE?.DRIVER_HEALTH, label: intl.formatMessage({ id:'DRIVER_HEALTH' })},
]