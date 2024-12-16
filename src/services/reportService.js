import Request from "./request";

export default class ReportService {
  static async getList(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'CustomerStatistical/reportAllStation',
        data: { ...data },
        query: null,
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(data)
        } else {
          return resolve(null)
        }
      })
    })
  }
  static async DataChart(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'CustomerSchedule/reportTotalByDay',
        data: { ...data },
        query: null,
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(data)
        } else {
          return resolve(null)
        }
      })
    })
  }
  static async DataScheduleByStation(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'CustomerSchedule/reportTotalScheduleByStation',
        data: { ...data },
        query: null,
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(data)
        } else {
          return resolve(null)
        }
      })
    })
  }
  static async DataActiveStation(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'Stations/reportAllActiveStation',
        data: { ...data },
        query: null,
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(data)
        } else {
          return resolve(null)
        }
      })
    })
  }
  static async DataStationArea(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'CustomerSchedule/reportTotalScheduleByStationArea',
        data: { ...data },
        query: null,
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(data)
        } else {
          return resolve(null)
        }
      })
    })
  }
  static async DatanotActiveStation(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'Stations/reportAllInactiveStation',
        data: { ...data },
        query: null,
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(data)
        } else {
          return resolve(null)
        }
      })
    })
  }
  static async ScheduleChart(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'CustomerSchedule/find',
        data: { ...data },
        query: null,
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(data)
        } else {
          return resolve(null)
        }
      })
    })
  }
  static async ScheduleOverview(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'CustomerSchedule/reportTotalByDay',
        data: { ...data },
        query: null,
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(data)
        } else {
          return resolve(null)
        }
      })
    })
  }
}
