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
  { value : 'ALL', label: 'Tất cả trung tâm'},
  { value: 1, label: 'Trung tâm đăng kiểm'},
  { value: 2, label: 'Nội bộ TTDK'},
  { value: 3, label: 'Garage'},
  { value: 4, label: 'Cứu hộ'},
  { value: 5, label: 'Đơn vị Bảo hiểm'},
  { value: 6, label: 'Đơn vị tư vấn'},
  { value: 7, label: 'Đơn vị liên kết'},
  { value: 8, label: 'Đơn vị quảng cáo'},
  { value: 9, label: 'Hợp tác xã'},
  { value: 10, label: 'Đơn vị mua bán xe cũ'},
  { value: 11, label: 'Mua bán phụ tùng ô tô'},
  { value: 12, label: 'Bãi giữ xe'},
  { value: 13, label: 'Đơn vị cải tạo xe'},
  { value: 14, label: 'Trường học lái xe'},
  { value: 15, label: 'Dịch vụ lái xe hộ'},
  { value: 16, label: 'Tư vấn sản xuất phụ tùng xe'},
  { value: 17, label: 'Khám sức khoẻ lái xe'},
]

export const CRIMINAL_STATUS = {
  NO: 'Chưa xử phạt',
  YES: 'Đã xử phạt',
  NOT_CRIMINAL: 'Không có cảnh báo',
}