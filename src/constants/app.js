export const FETCH_APPS_REQUEST = 'FETCH_APPS_REQUEST'
export const FETCH_APPS_SUCCESS = 'FETCH_APPS_SUCCESS'
export const FETCH_APP_CHANGE = 'FETCH_APP_CHANGE'

export const VEHICLE_TYPE = {
  CAR : "1",
  OTHER : "10",
  RO_MOOC : "20"
}

export const SCHEDULE_STATUS = {
  NEW: 0,
  CONFIRMED: 10,
  CANCELED: 20,
  CLOSED: 30,
}

export const LICENSEPLATES_COLOR = {
  white: 1,
  blue: 2,
  yellow: 3,
  red: 4,
}

export const LOCAL = {
  normal : 1,
  high_level : 2
}

export const APP_USER_ROLE  = {
  patern : 1,
  technician : 2,
  technicians_senior : 3,
  accountant : 4
}

export const VEHICLEVERIFIEDINFO = {
  NOT_VERIFIED: 0,
  VERIFIED: 1,
  VERIFIED_BUT_NO_DATA: -1,
  VERIFIED_BUT_WRONG_EXPIRE_DATE: -2
}

export const SCHEDULE_TYPE = {
  VEHICLE_INSPECTION: 1, // Đăng kiểm xe cũ
  NEW_VEHICLE_INSPECTION: 2, // đăng kiểm xe mới
  REGISTER_NEW_VEHICLE: 3, // Nộp hồ sơ xe mới
}

