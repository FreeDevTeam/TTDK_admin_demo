import { Check, Edit } from 'react-feather'

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

export const BANNER_TYPE = [
  {
    title:'Danh sách trung tâm',
    value:10
  },
]
export const STATUS_OPTIONS = {
  STATUS:{ value: '', label: 'stationStatus' },
  OK:{ value: 1, label: 'ok' },
  LOCKED:{ value: 0, label: 'locked' },
}
export const STATION_TYPES = {
  ALL_TYPE:{ value: '', label: 'station_type' },
  STATION:{ value: 1, label: 'external' },
  GARAGE:{ value: 3, label: 'garage' },
  INSURANCE:{ value: 5, label: 'insurance_unit' },
  HELP:{ value: 4, label: 'help_service' },
  CONSULTING:{ value: 6, label: 'consulting_unit' },
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
  NOT_VERIFIED: 0, // chưa kiểm tra
  VERIFIED: 1,  // đã kt và có dữ liệu
  VERIFIED_BUT_NO_DATA: -1, // đã kt nhưng ko có dữ liệu
  VERIFIED_BUT_WRONG_EXPIRE_DATE: -2, // đã kt nhưng sai ngày hết hạn
  VERIFIED_BUT_WRONG_VEHICLE_TYPE: -10, //Đã kiểm tra nhưng sai loai phuong tien
  VERIFIED_BUT_ERROR: -3, //Đã kiểm tra nhưng thất bại
  NOT_VALID_SERIAL: -20, // số seri GCN ko hợp lệ
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
  INACTIVE : 'INACTIVE',
  MAINTENANCE_SERVICE : "MAINTENANCE_SERVICE",
  REPAIR : "REPAIR"
}

export const DOCUMENT_CATEGORY = {
  OFFICIAL_LETTER: 1, //Công văn
  ESTABLISHMENT_APPOINTMENT_DOCUMENT: 2, // Giấy tờ thành lập / bổ nhiệm 
  PERIODIC_INSPECTION_DOCUMENT: 3, //Văn bản kiểm tra định kỳ
  TASK_ASSIGNMENT_FORM: 4 // Phiếu phân công nhiệm vụ
}

export const STATION_TYPE = {
  EXTERNAL: 1, //Trung tâm đăng kiểm
  INTERNAL: 2, //Nội bộ TTDK
  GARAGE: 3, //Garage
  HELPSERVICE: 4, //cứu hộ
  INSURANCE: 5, // Đơn vị Bảo hiểm
  CONSULTING: 6, // Đơn vị tư vấn
  AFFILIATE: 7, // Đơn vị liên kết
  ADVERTISING: 8, // Đơn vị quảng cáo
}

export const PAYMENT_TYPE_STATE = {
  CASH: 1, // Thanh toán bằng tiền mặt
  BANK_TRANSFER: 2, // Chuyển tiền qua tài khoản ngân hàng
  VNPAY_PERSONAL: 3, // Chuyển tiền qua VNPAY
  CREDIT_CARD: 4, // Thanh toán bằng thẻ tín dụng
  MOMO_PERSONAL: 5, // Chuyển tiền qua MoMo
  ATM_TRANSFER: 6, // Thanh toán bằng thẻ nội địa (ATM)
  MOMO_BUSINESS: 7, // Thanh toán qua MoMo
}

export const optionPaymentTypes =  [
    {
      value: PAYMENT_TYPE_STATE.CASH,
      label: 'pay_cash',
      icon: <Check color="green" />
    },
    {
      value: PAYMENT_TYPE_STATE.BANK_TRANSFER,
      label: 'pay_bank' ,
      icon: <Check color="green" />,
      edit : <Edit color="cornflowerblue" size={16}/>
    },
    {
      value: PAYMENT_TYPE_STATE.VNPAY_PERSONAL,
      label:  'pay_vnpay' ,
      icon: <Check color="green" />
    },
    {
      value: PAYMENT_TYPE_STATE.CREDIT_CARD,
      label:  'pay_card' ,
      icon: <Check color="green" />
    },
    {
      value: PAYMENT_TYPE_STATE.MOMO_PERSONAL,
      label:  'pay_momo' ,
      icon: <Check color="green" />,
      edit : <Edit color="cornflowerblue" size={16}/>
    },
    {
      value: PAYMENT_TYPE_STATE.ATM_TRANSFER,
      label: 'pay_atm' ,
      icon: <Check color="green" />
    },
    {
      value: PAYMENT_TYPE_STATE.MOMO_BUSINESS,
      label: 'pay_business' ,
      icon: <Check color="green" />,
      edit : <Edit color="cornflowerblue" size={16}/>
    }
  ];
