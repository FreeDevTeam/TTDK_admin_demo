export const STATION_DEVICES_STATUS = {
  NEW: "NEW",// Mới
  ACTIVE: "ACTIVE",// Đang hoạt động
  MAINTENANCE: "MAINTENANCE", // Bảo trì
  INACTIVE: "INACTIVE" // Ngừng hoạt động
}

export const getStationDevicesState = (intl) => ({
  [STATION_DEVICES_STATUS.NEW]: intl.formatMessage({ id: "device_status_new" }),
  [STATION_DEVICES_STATUS.ACTIVE]: intl.formatMessage({ id: "device_status_active" }),
  [STATION_DEVICES_STATUS.MAINTENANCE]: intl.formatMessage({ id: "device_status_maintenance" }),
  [STATION_DEVICES_STATUS.INACTIVE]: intl.formatMessage({ id: "device_status_inactive" }),
});

export const getStationDeviceStatusOptions = (intl) => {
  return [
    { label: intl.formatMessage({ id: "all" }), value: "" },
    { label: intl.formatMessage({ id: "device_status_new" }), value: STATION_DEVICES_STATUS.NEW },
    { label: intl.formatMessage({ id: "device_status_active" }), value: STATION_DEVICES_STATUS.ACTIVE },
    { label: intl.formatMessage({ id: "device_status_maintenance" }), value: STATION_DEVICES_STATUS.MAINTENANCE },
    { label: intl.formatMessage({ id: "device_status_inactive" }), value: STATION_DEVICES_STATUS.INACTIVE }
  ];
};