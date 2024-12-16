import { Check, Edit } from 'react-feather'
import teleSvg from '@src/assets/images/svg/telegram.svg'
import zalo from '@src/assets/images/svg/zalo.svg'
import ttdk from '@src/assets/images/svg/ttdk.svg'
import fpt from '@src/assets/images/svg/fpt.svg'
import viettel from '@src/assets/images/svg/viettel.svg'
import vnpt from '@src/assets/images/svg/vnpt.svg'
import vivas from '@src/assets/images/icons/logo_vivas.png'
import vmg from '@src/assets/images/icons/vmg.png'
import zaloZns from '@src/assets/images/icons/zalo-zns.png'
import sunpay from '@src/assets/images/icons/sunpay.png'
import capitalpay from '@src/assets/images/svg/capitalpay.svg'
import mailgun from '@src/assets/images/svg/mailgun.svg'
import vnpay from '@src/assets/images/svg/vnpay.svg'


export const FETCH_APPS_REQUEST = 'FETCH_APPS_REQUEST'
export const FETCH_APPS_SUCCESS = 'FETCH_APPS_SUCCESS'
export const FETCH_APP_CHANGE = 'FETCH_APP_CHANGE'

export const ALL_AREA = 'ALL'

export const VEHICLE_TYPE = {
  CAR : 1,
  OTHER : 10,
  RO_MOOC : 20
}

export const SIZE_INPUT = 'md'
export const ACTIVE_STATUS = {
  OPEN : '1',
  LOCK : '0'
}

export const SCHEDULE_STATUS = {
  NEW: 0,
  CONFIRMED: 10,
  CANCELED: 20,
  CLOSED: 30,
}

const BANNER_SECTION = {
  HOMEPAGE_MAIN_BANNER: 10, // Banner chính trang chủ trang chủ
  HOMEPAGE_HOT_BANNER: 11, // Banner nổi bật trên trang chủ
  HOMEPAGE_BOTTOM_BANNER: 12, // Banner trang chủ dưới
  WELCOME_SCREEN: 13, // Banner màn hình chào
  DETAIL_SCHEDULE: 14, // Banner chi tiết lịch hẹn
  SUCCESSFUL_APPOINTMENT: 15, // Banner đặt lịch thành công
  // Từ 1001 - 1999 => Dùng cho các "Điểm dịch vụ"
  EXTERNAL: 1001, //Trung tâm đăng kiểm
  INTERNAL: 1002, //Nội bộ TTDK
  GARAGE: 1003, //Garage
  HELPSERVICE: 1004, //cứu hộ
  INSURANCE: 1005, // Đơn vị Bảo hiểm
  CONSULTING: 1006, // Đơn vị tư vấn
  AFFILIATE: 1007, // Đơn vị liên kết
  ADVERTISING: 1008, // Đơn vị quảng cáo
  COOPERATIVE: 1009, // Hợp tác xã
  USED_VEHICLES_DEALERSHIP: 1010, // Đơn vị mua bán xe cũ
  SPARE_PARTS_DEALERSHIP: 1011, // Mua bán phụ tùng ô tô
  PARKING_LOT: 1012, // Bãi giữ xe
  VEHICLE_MODIFICATION: 1013, // Đơn vị cải tạo xe
  DRIVING_SCHOOL: 1014, // Trường học lái xe
  CHAUFFEUR_SERVICE: 1015, // Dịch vụ lái xe hộ
  PARTS_MANUFACTURING_CONSULTANCY: 1016, // Tư vấn sản xuất phụ tùng xe
  DRIVER_HEALTH: 1017, //  Khám sức khoẻ lái xe
  CAR_EVALUATION_SERVICE: 1018, // Dịch vụ định giá xe
}

export const BANNER_TYPE = [
  { title: 'Banner chính trang chủ', value: BANNER_SECTION.HOMEPAGE_MAIN_BANNER },
  { title: 'Banner quảng cáo', value: BANNER_SECTION.HOMEPAGE_HOT_BANNER },
  { title: 'Banner trang chủ dưới', value: BANNER_SECTION.HOMEPAGE_BOTTOM_BANNER },
  { title: 'Banner màn hình chào', value: BANNER_SECTION.WELCOME_SCREEN },
  { title: 'Banner chi tiết lịch hẹn', value: BANNER_SECTION.DETAIL_SCHEDULE },
  { title: 'Banner đặt lịch thành công', value: BANNER_SECTION.SUCCESSFUL_APPOINTMENT },
  // Các loại banner điểm dịch vụ
  { title: 'Bãi giữ xe', value: BANNER_SECTION.PARKING_LOT },
  { title: 'Garage', value: BANNER_SECTION.GARAGE },
  { title: 'Cứu hộ đăng kiểm', value: BANNER_SECTION.HELPSERVICE },
  { title: 'Dịch vụ lái xe hộ', value: BANNER_SECTION.CHAUFFEUR_SERVICE },
  { title: 'Dịch vụ định giá xe', value: BANNER_SECTION.CAR_EVALUATION_SERVICE },
  { title: 'Đơn vị Bảo hiểm', value: BANNER_SECTION.INSURANCE },
  { title: 'Đơn vị tư vấn', value: BANNER_SECTION.CONSULTING },
  { title: 'Đơn vị liên kết', value: BANNER_SECTION.AFFILIATE },
  { title: 'Đơn vị quảng cáo', value: BANNER_SECTION.ADVERTISING },
  { title: 'Đơn vị mua bán xe cũ', value: BANNER_SECTION.USED_VEHICLES_DEALERSHIP },
  { title: 'Đơn vị cải tạo xe', value: BANNER_SECTION.VEHICLE_MODIFICATION },
  { title: 'Hợp tác xã', value: BANNER_SECTION.COOPERATIVE },
  { title: 'Mua bán phụ tùng ô tô', value: BANNER_SECTION.SPARE_PARTS_DEALERSHIP },
  { title: 'Nội bộ TTDK', value: BANNER_SECTION.INTERNAL },
  { title: 'Khám sức khoẻ lái xe', value: BANNER_SECTION.DRIVER_HEALTH },
  { title: 'Trung tâm đăng kiểm', value: BANNER_SECTION.EXTERNAL },
  { title: 'Trường học lái xe', value: BANNER_SECTION.DRIVING_SCHOOL },
  { title: 'Tư vấn sản xuất phụ tùng xe', value: BANNER_SECTION.PARTS_MANUFACTURING_CONSULTANCY },
];

export const STATUS_OPTIONS = {
  STATUS:{ value: '', label: 'stationStatus' },
  OK:{ value: 1, label: 'ok' },
  LOCKED:{ value: 0, label: 'locked' },
}
export const NAVIGATION_TYPE= {
  DIRECT: { value: 1, label: "Trực tiếp"},
  EXTERNAL: { value: 2, label: "Ra ngoài"},
  INTERNAL: { value: 3, label: "Nội bộ"},
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
  normal : 2,
  high_level : 3
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
  VEHICLE_INSPECTION: 1, // "Đăng kiểm xe định kỳ"
  NEW_VEHICLE_INSPECTION: 2, // đăng kiểm xe mới
  REGISTER_NEW_VEHICLE: 3, // Nộp hồ sơ xe mới
  CONSULTANT_MAINTENANCE: 7, // Tư vấn bảo dưỡng
  CONSULTANT_INSURANCE: 8, // Tư bảo hiểm
  CONSULTANT_RENOVATION: 9, // Tư vấn hoán cải
  CHANGE_REGISTATION : 4, // Thay đổi thông tin xe
  CONSULTANT_INSURANCE_TNDS : 14, // "Tư vấn bảo hiểm TNDS xe ô tô"
  LOST_REGISTRATION_PAPER : 10, // "Mất giấy đăng kiểm"
  REISSUE_INSPECTION_STICKER : 11, // "Cấp lại tem đăng kiểm"
  TRAFFIC_FINE_CONSULTATION : 13, // "Tư vấn xử lý phạt nguội"
  VEHICLE_INSPECTION_CONSULTATION : 12, // "Tư vấn đăng kiểm xe"
}

export const CUSTOMER_RECEIPT_STATUS = {
  NEW: 'New', // chưa thanh toán
  PENDING: 'Pending', // đang xử lý
  FAILED: 'Failed', // thanh toán thất bại
  SUCCESS: 'Success', // thanh toán thành công
  CANCELED: 'Canceled', // đã hủy
  PROCESSING: 'Processing', // Tính phí thất bại cần xử lý lại
}

export const PAYMENT_TYPES =  {
  CASH: 1, // tiền mặt
  BANK_TRANSFER: 2, // chuyển khoản
  VNPAY_PERSONAL: 3, // Chuyển tiền qua VNPAY
  CREDIT_CARD: 4, // thẻ tín dụng
  MOMO_PERSONAL: 5, // Chuyển tiền qua MoMo
  ATM_TRANSFER: 6, // Thanh toán bằng thẻ nội địa (ATM)
  MOMO_BUSINESS: 7, // Thanh toán qua MoMo
  ZALOPAY_PERSONAL:8, // Chuyển tiền qua Zalo
  VIETTELPAY_PERSONAL:9, // Chuyển tiền qua Viettelpay
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

  export const MAX_SCHEDULE_PER_INSPECTION_LINE = 100;

  export const THIRDPARTY_CODE = {
    //NOTIFICATION
    ZALO: 'ZALO',
    TELEGRAM: 'TELEGRAM',
    //SMS
    TTDK: 'TTDK',
    VIVAS: 'VIVAS',
    VMG:'VMG',
    FPT: 'FPT',
    VNPT: 'VNPT',
    VIETTEL: 'VIETTEL',
    //ZALO_MESSAGE
    ZALO_ZNS: 'ZALO_ZNS',
    SMARTGIFT: 'SMARTGIFT',
    //EMAIL
    SMTP: 'SMTP',
    MAILGUN: 'MALGUN'
  
  }
  
  export const THIRDPARTY_CATEGORY = {
    PAYMENT: 1,
    NOTIFICATION: 2000,
    SMS: 3000,
    ZALO_MESSAGE: 4000,
    EMAIL: 5000
  }
  
  //map image của thirdparty
  export const THIRDPARTY_CODE_IMAGE = {
    [THIRDPARTY_CODE.CAPITAL_PAY]: capitalpay,
    [THIRDPARTY_CODE.SUNPAY]: sunpay,
    [THIRDPARTY_CODE.VNPAYQR]: vnpay,
    [THIRDPARTY_CODE.TELEGRAM]: teleSvg,
    [THIRDPARTY_CODE.ZALO]: zalo,
    [THIRDPARTY_CODE.TTDK]: ttdk, 
    [THIRDPARTY_CODE.VIVAS]: vivas,
    [THIRDPARTY_CODE.VMG]: vmg,
    [THIRDPARTY_CODE.FPT]: fpt,
    [THIRDPARTY_CODE.VNPT]: vnpt,
    [THIRDPARTY_CODE.VIETTEL]: viettel,
    [THIRDPARTY_CODE.ZALO_ZNS]: zaloZns,
    [THIRDPARTY_CODE.MAILGUN]: mailgun
  
  }
  
  // tắt mở sử dụng thirdparty
  export const THIRDPARTY_CODE_ENABLE = {
    [THIRDPARTY_CODE.CAPITAL_PAY]: false,
    [THIRDPARTY_CODE.SUNPAY]: false,
    [THIRDPARTY_CODE.VNPAYQR]: false,
    [THIRDPARTY_CODE.TELEGRAM]: true,
    [THIRDPARTY_CODE.ZALO]: false,
  
  }
  



