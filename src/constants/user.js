export const COMPANY_STATUS = {
  NOT_ACCEPT : 0, // chưa xác minh
  ACCEPT: 1, // chấp nhận duyệt công ty
  NOT_VERIFIED: 2 // từ chối duyệt công ty
}

export const APP_USER_CATEGORY = {
  COMPANY: 2,
  NORMAL_USER: 1,
}
export const DECETRALIZATION = {
  VIEW_DASHBOARD : 'VIEW_DASHBOARD',
  VIEW_STATIONS : 'VIEW_STATIONS',
  VIEW_STATIONS_USERS : 'VIEW_STATIONS_USERS',
  VIEW_STATIONS_STAFFS : 'VIEW_STATIONS_STAFFS',
  VIEW_STATIONS_VEHICLES : 'VIEW_STATIONS_VEHICLES',
  VIEW_STATIONS_DOCUMENT : 'VIEW_STATIONS_DOCUMENT',
  VIEW_STATIONS_SCHEDULE : 'VIEW_STATIONS_SCHEDULE',
  VIEW_STATIONS_REPORT : 'VIEW_STATIONS_REPORT',
  VIEW_STATIONS_DEVICES : 'VIEW_STATIONS_DEVICES',
  VIEW_APP_USERS : 'VIEW_APP_USERS',
  VIEW_STAFFS : 'VIEW_STAFFS',
  VIEW_CHAT : 'VIEW_CHAT',
  VIEW_NOTIFICATION : 'VIEW_NOTIFICATION',
  VIEW_DOCUMENTS : 'VIEW_DOCUMENTS',
  VIEW_NEWS : 'VIEW_NEWS',
  VIEW_PAYMENTS : 'VIEW_PAYMENTS',
  VIEW_INTEGRATIONS : 'VIEW_INTEGRATIONS',
  VIEW_SYSTEM_CONFIGURATIONS : 'VIEW_SYSTEM_CONFIGURATIONS',
  VIEW_VEHICLE : 'VIEW_VEHICLE'
}

export const stationTypes = [
  { value: 'EXTERNAL', label:  'external' },
  { value: 'INTERNAL', label: 'internal' },
  { value: 'GARAGE', label: 'garage' },
  { value: 'HELPSERVICE', label: 'help_service' },
  { value: 'INSURANCE', label: 'INSURANCE' },
  { value: 'CONSULTING', label: 'consulting_unit' },
  { value: 'AFFILIATE', label: 'AFFILIATE' },
  { value: 'ADVERTISING', label: 'ADVERTISING' },
  { value: 'COOPERATIVE', label: 'COOPERATIVE' },
  { value: 'USED_VEHICLES_DEALERSHIP', label: 'USED_VEHICLES_DEALERSHIP' },
  { value: 'SPARE_PARTS_DEALERSHIP', label: 'SPARE_PARTS_DEALERSHIP' },
  { value: 'PARKING_LOT', label: 'PARKING_LOT' },
  { value: 'VEHICLE_MODIFICATION', label: 'VEHICLE_MODIFICATION' },
  { value: 'DRIVING_SCHOOL', label: 'DRIVING_SCHOOL' },
  { value: 'CHAUFFEUR_SERVICE', label: 'CHAUFFEUR_SERVICE' },
  { value: 'PARTS_MANUFACTURING_CONSULTANCY', label: 'PARTS_MANUFACTURING_CONSULTANCY' },
  { value: 'DRIVER_HEALTH', label: 'DRIVER_HEALTH' },
]

export const dataTest = {
  resultReport : [
    {
      STT : 1,
      PhanNhomPhuongTien : "Ô tô từ 9 ghế đổ xuống, CThg",
      Thu100SoLuot : Math.floor(Math.random() * 900) + 100,
      Thu100GiaKD : Math.floor(Math.random() * 900) + 100,
      Thu50SoLuot : Math.floor(Math.random() * 900) + 100,
      Thu50GiaKD : Math.floor(Math.random() * 900) + 100,
      Thu0SoLuot : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan1Dat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan1KoDat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan2Dat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan2KoDat : Math.floor(Math.random() * 900) + 100,
      TemKiemDinhKDVT : Math.floor(Math.random() * 900) + 100,
      TemKiemDinhKoKDVT : Math.floor(Math.random() * 900) + 100,
      KiemDinhXeCuLan1 : Math.floor(Math.random() * 900) + 100,
      KiemDinhXeCuLan2 : Math.floor(Math.random() * 900) + 100,
    },
    {
      STT : 2,
      PhanNhomPhuongTien : "Ô tô khách 10 - 24 ghế",
      Thu100SoLuot : Math.floor(Math.random() * 900) + 100,
      Thu100GiaKD : Math.floor(Math.random() * 900) + 100,
      Thu50SoLuot : Math.floor(Math.random() * 900) + 100,
      Thu50GiaKD : Math.floor(Math.random() * 900) + 100,
      Thu0SoLuot : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan1Dat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan1KoDat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan2Dat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan2KoDat : Math.floor(Math.random() * 900) + 100,
      TemKiemDinhKDVT : Math.floor(Math.random() * 900) + 100,
      TemKiemDinhKoKDVT : Math.floor(Math.random() * 900) + 100,
      KiemDinhXeCuLan1 : Math.floor(Math.random() * 900) + 100,
      KiemDinhXeCuLan2 : Math.floor(Math.random() * 900) + 100,
    },
    {
      STT : 3,
      PhanNhomPhuongTien : "Ô tô khách 25 - 40 ghế",
      Thu100SoLuot : Math.floor(Math.random() * 900) + 100,
      Thu100GiaKD : Math.floor(Math.random() * 900) + 100,
      Thu50SoLuot : Math.floor(Math.random() * 900) + 100,
      Thu50GiaKD : Math.floor(Math.random() * 900) + 100,
      Thu0SoLuot : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan1Dat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan1KoDat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan2Dat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan2KoDat : Math.floor(Math.random() * 900) + 100,
      TemKiemDinhKDVT : Math.floor(Math.random() * 900) + 100,
      TemKiemDinhKoKDVT : Math.floor(Math.random() * 900) + 100,
      KiemDinhXeCuLan1 : Math.floor(Math.random() * 900) + 100,
      KiemDinhXeCuLan2 : Math.floor(Math.random() * 900) + 100,
    },
    {
      STT : 4,
      PhanNhomPhuongTien : "Ô tô khách trên 40 ghế",
      Thu100SoLuot : Math.floor(Math.random() * 900) + 100,
      Thu100GiaKD : Math.floor(Math.random() * 900) + 100,
      Thu50SoLuot : Math.floor(Math.random() * 900) + 100,
      Thu50GiaKD : Math.floor(Math.random() * 900) + 100,
      Thu0SoLuot : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan1Dat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan1KoDat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan2Dat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan2KoDat : Math.floor(Math.random() * 900) + 100,
      TemKiemDinhKDVT : Math.floor(Math.random() * 900) + 100,
      TemKiemDinhKoKDVT : Math.floor(Math.random() * 900) + 100,
      KiemDinhXeCuLan1 : Math.floor(Math.random() * 900) + 100,
      KiemDinhXeCuLan2 : Math.floor(Math.random() * 900) + 100,
    },
    {
      STT : 5,
      PhanNhomPhuongTien : "Ô tô tải đến 2T",
      Thu100SoLuot : Math.floor(Math.random() * 900) + 100,
      Thu100GiaKD : Math.floor(Math.random() * 900) + 100,
      Thu50SoLuot : Math.floor(Math.random() * 900) + 100,
      Thu50GiaKD : Math.floor(Math.random() * 900) + 100,
      Thu0SoLuot : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan1Dat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan1KoDat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan2Dat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan2KoDat : Math.floor(Math.random() * 900) + 100,
      TemKiemDinhKDVT : Math.floor(Math.random() * 900) + 100,
      TemKiemDinhKoKDVT : Math.floor(Math.random() * 900) + 100,
      KiemDinhXeCuLan1 : Math.floor(Math.random() * 900) + 100,
      KiemDinhXeCuLan2 : Math.floor(Math.random() * 900) + 100,
    },
    {
      STT : 6,
      PhanNhomPhuongTien : "Ô tô tải trên 2T đến 7T",
      Thu100SoLuot : Math.floor(Math.random() * 900) + 100,
      Thu100GiaKD : Math.floor(Math.random() * 900) + 100,
      Thu50SoLuot : Math.floor(Math.random() * 900) + 100,
      Thu50GiaKD : Math.floor(Math.random() * 900) + 100,
      Thu0SoLuot : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan1Dat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan1KoDat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan2Dat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan2KoDat : Math.floor(Math.random() * 900) + 100,
      TemKiemDinhKDVT : Math.floor(Math.random() * 900) + 100,
      TemKiemDinhKoKDVT : Math.floor(Math.random() * 900) + 100,
      KiemDinhXeCuLan1 : Math.floor(Math.random() * 900) + 100,
      KiemDinhXeCuLan2 : Math.floor(Math.random() * 900) + 100,
    },
    {
      STT : 7,
      PhanNhomPhuongTien : "Ô tô tải trên 7T đến 20T, CD",
      Thu100SoLuot : Math.floor(Math.random() * 900) + 100,
      Thu100GiaKD : Math.floor(Math.random() * 900) + 100,
      Thu50SoLuot : Math.floor(Math.random() * 900) + 100,
      Thu50GiaKD : Math.floor(Math.random() * 900) + 100,
      Thu0SoLuot : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan1Dat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan1KoDat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan2Dat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan2KoDat : Math.floor(Math.random() * 900) + 100,
      TemKiemDinhKDVT : Math.floor(Math.random() * 900) + 100,
      TemKiemDinhKoKDVT : Math.floor(Math.random() * 900) + 100,
      KiemDinhXeCuLan1 : Math.floor(Math.random() * 900) + 100,
      KiemDinhXeCuLan2 : Math.floor(Math.random() * 900) + 100,
    },
    {
      STT : 8,
      PhanNhomPhuongTien : "Ô tô tải trên 20T, CD",
      Thu100SoLuot : Math.floor(Math.random() * 900) + 100,
      Thu100GiaKD : Math.floor(Math.random() * 900) + 100,
      Thu50SoLuot : Math.floor(Math.random() * 900) + 100,
      Thu50GiaKD : Math.floor(Math.random() * 900) + 100,
      Thu0SoLuot : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan1Dat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan1KoDat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan2Dat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan2KoDat : Math.floor(Math.random() * 900) + 100,
      TemKiemDinhKDVT : Math.floor(Math.random() * 900) + 100,
      TemKiemDinhKoKDVT : Math.floor(Math.random() * 900) + 100,
      KiemDinhXeCuLan1 : Math.floor(Math.random() * 900) + 100,
      KiemDinhXeCuLan2 : Math.floor(Math.random() * 900) + 100,
    },
    {
      STT : 9,
      PhanNhomPhuongTien : "PT vận tải nhỏ",
      Thu100SoLuot : Math.floor(Math.random() * 900) + 100,
      Thu100GiaKD : Math.floor(Math.random() * 900) + 100,
      Thu50SoLuot : Math.floor(Math.random() * 900) + 100,
      Thu50GiaKD : Math.floor(Math.random() * 900) + 100,
      Thu0SoLuot : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan1Dat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan1KoDat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan2Dat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan2KoDat : Math.floor(Math.random() * 900) + 100,
      TemKiemDinhKDVT : Math.floor(Math.random() * 900) + 100,
      TemKiemDinhKoKDVT : Math.floor(Math.random() * 900) + 100,
      KiemDinhXeCuLan1 : Math.floor(Math.random() * 900) + 100,
      KiemDinhXeCuLan2 : Math.floor(Math.random() * 900) + 100,
    },
    {
      STT : 10,
      PhanNhomPhuongTien : "Ro mooc, sơ mi rooc moc",
      Thu100SoLuot : Math.floor(Math.random() * 900) + 100,
      Thu100GiaKD : Math.floor(Math.random() * 900) + 100,
      Thu50SoLuot : Math.floor(Math.random() * 900) + 100,
      Thu50GiaKD : Math.floor(Math.random() * 900) + 100,
      Thu0SoLuot : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan1Dat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan1KoDat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan2Dat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan2KoDat : Math.floor(Math.random() * 900) + 100,
      TemKiemDinhKDVT : Math.floor(Math.random() * 900) + 100,
      TemKiemDinhKoKDVT : Math.floor(Math.random() * 900) + 100,
      KiemDinhXeCuLan1 : Math.floor(Math.random() * 900) + 100,
      KiemDinhXeCuLan2 : Math.floor(Math.random() * 900) + 100,
    },
    {
      STT : 11,
      PhanNhomPhuongTien : "xe lam, xích lô máy 3 bánh",
      Thu100SoLuot : Math.floor(Math.random() * 900) + 100,
      Thu100GiaKD : Math.floor(Math.random() * 900) + 100,
      Thu50SoLuot : Math.floor(Math.random() * 900) + 100,
      Thu50GiaKD : Math.floor(Math.random() * 900) + 100,
      Thu0SoLuot : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan1Dat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan1KoDat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan2Dat : Math.floor(Math.random() * 900) + 100,
      KiemDinhLan2KoDat : Math.floor(Math.random() * 900) + 100,
      TemKiemDinhKDVT : Math.floor(Math.random() * 900) + 100,
      TemKiemDinhKoKDVT : Math.floor(Math.random() * 900) + 100,
      KiemDinhXeCuLan1 : Math.floor(Math.random() * 900) + 100,
      KiemDinhXeCuLan2 : Math.floor(Math.random() * 900) + 100,
    },
  ],
  totalStandards : 5667,
  totalNotStandards : 4060,
  totalAccreditation : 4459,
  totalInspectionPrice : 8247,
  totalGrant : 7193,
  totalAmount : 5330, 
  grantedTemporary : 8784,
  carsFailed : 7690,
  precentVehicle : [
    {
      Cum : "Số PT không đạt",
      NhanDang : Math.floor(Math.random() * 900) + 100,
      KhungGhe : Math.floor(Math.random() * 900) + 100,
      DcoHeThong : Math.floor(Math.random() * 900) + 100,
      TruyenLuc : Math.floor(Math.random() * 900) + 100,
      Phanh : Math.floor(Math.random() * 900) + 100,
      Lai : Math.floor(Math.random() * 900) + 100,
      Treo : Math.floor(Math.random() * 900) + 100,
      Lop : Math.floor(Math.random() * 900) + 100,
      Den : Math.floor(Math.random() * 900) + 100,
      KhiXa : Math.floor(Math.random() * 900) + 100,
      TiengOn : Math.floor(Math.random() * 900) + 100,
      htKhac : Math.floor(Math.random() * 900) + 100,
    },
    {
      Cum : "Tỷ lệ %",
      NhanDang : Math.floor(Math.random() * 900) + 100,
      KhungGhe : Math.floor(Math.random() * 900) + 100,
      DcoHeThong : Math.floor(Math.random() * 900) + 100,
      TruyenLuc : Math.floor(Math.random() * 900) + 100,
      Phanh : Math.floor(Math.random() * 900) + 100,
      Lai : Math.floor(Math.random() * 900) + 100,
      Treo : Math.floor(Math.random() * 900) + 100,
      Lop : Math.floor(Math.random() * 900) + 100,
      Den : Math.floor(Math.random() * 900) + 100,
      KhiXa : Math.floor(Math.random() * 900) + 100,
      TiengOn : Math.floor(Math.random() * 900) + 100,
      htKhac : Math.floor(Math.random() * 900) + 100,
    }
  ],
  Tong100SoLuot : 29324,
  Tong100KD : 2385,
  Tong50SoLuot : 8284,
  Tong50KD : 5647,
  TongThu0 : 3847,
  TongLan1Dat : 4857,
  TongLan1KDat : 8574,
  Tonglan2Dat : 38457,
  TongLan2KDat : 7463,
  TongTemD : 4857,
  TongTemKhongK : 857,
  TongKiemDinhCuLan1 : 3878,
  TongKiemDinhCuLan2 : 3456,
}