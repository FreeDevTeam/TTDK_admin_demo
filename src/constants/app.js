export const FETCH_APPS_REQUEST = 'FETCH_APPS_REQUEST'
export const FETCH_APPS_SUCCESS = 'FETCH_APPS_SUCCESS'
export const FETCH_APP_CHANGE = 'FETCH_APP_CHANGE'

export const VEHICLE_TYPE = {
  CAR : 1,
  OTHER : 10,
  RO_MOOC : 20
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

export const CUSTOMER_RECEIPT_STATUS = {
  NEW: 'New', // chưa thanh toán
  PENDING: 'Pending', // đang xử lý
  FAILED: 'Failed', // thanh toán thất bại
  SUCCESS: 'Success', // thanh toán thành công
  CANCELED: 'Canceled', // đã hủy
}

export const PAYMENT_TYPES =  {
  CASH: 1, // tiền mặt
  BANK_TRANSFER: 2, // chuyển khoản
  VNPAY: 3, // vnpay
  CREDIT_CARD: 4, // thẻ tín dụng
  MOMO: 5, // momo
}

export const FUEL_TYPE = {
  GASOLINE : 1,
  OIL : 2
}

export const DEVICE_STATUS = {
  NEW : 'NEW',
  ACTIVE : 'ACTIVE',
  MAINTENANCE : 'MAINTENANCE',
  INACTIVE : 'INACTIVE'
}

export const DOCUMENT_CATEGORY = {
  OFFICIAL_LETTER: 1, //Công văn
  ESTABLISHMENT_APPOINTMENT_DOCUMENT: 2, // Giấy tờ thành lập / bổ nhiệm 
  PERIODIC_INSPECTION_DOCUMENT: 3, //Văn bản kiểm tra định kỳ
  TASK_ASSIGNMENT_FORM: 4 // Phiếu phân công nhiệm vụ
}

