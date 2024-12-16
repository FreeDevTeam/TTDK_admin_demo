import Request from './request'

export default class IntegratedService{
    static async getList(data, newToken) {
        return new Promise((resolve) => {
          Request.send({
            method: 'POST',
            path: 'Stations/find',
            data: { ...data },
            query: null,
            headers: {
              Authorization: `Bearer ` + newToken
            }
          }).then((result = {}) => {
            const { statusCode, data } = result
            if (statusCode === 200) {
              return resolve(result)
            } else {
              return resolve(null)
            }
          })
        })
      }
    
    static async handleUpdateData(data, newToken) {
        return new Promise((resolve) => {
          Request.send({
            method: 'POST',
            path: 'Stations/updateSettingStation',
            data: { ...data },
            query: null,
            headers: {
              Authorization: `Bearer ` + newToken
            }
          }).then((result = {}) => {
            const { statusCode, data } = result
            if (statusCode === 200) {
              return resolve(result)
            } else {
              return resolve(null)
            }
          })
        })
      }
    
    static async handleUpdateDataPayment(data, newToken) {
        return new Promise((resolve) => {
          Request.send({
            method: 'POST',
            path: 'Stations/updateById',
            data: { ...data },
            query: null,
            headers: {
              Authorization: `Bearer ` + newToken
            }
          }).then((result = {}) => {
            const { statusCode, data } = result
            if (statusCode === 200) {
              return resolve(result)
            } else {
              return resolve(null)
            }
          })
        })
      }

    static async getStationById(data, newToken) {
        return new Promise((resolve) => {
          Request.send({
            method: 'POST',
            path: 'Stations/findById',
            data: { ...data },
            query: null,
            headers: {
              Authorization: `Bearer ` + newToken
            }
          }).then((result = {}) => {
            const { statusCode, data } = result
            if (statusCode === 200) {
              return resolve(result)
            } else {
              return resolve(null)
            }
          })
        })
      }
}