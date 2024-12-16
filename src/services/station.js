import Request from "./request";

export default class SationService {
    static async getList(data, newToken) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'CustomerSchedule/find',
                data: { ...data },
                query: null,
                headers: {
                    Authorization: `Bearer ` + newToken,
                },
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
    static async CustomerById(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'CustomerSchedule/findById',
                data: { ...data },
                query: null,
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
    static async getListStation(data, newToken) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'Stations/find',
                data: { ...data },
                query: null,
                headers: {
                    Authorization: `Bearer ` + newToken,
                },
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
    static async handleUpdateData(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'Stations/updateById',
                data: { ...data },
                query: null,
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
    static async handleAddStation(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'Stations/insert',
                data: { ...data },
                query: null,
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
    static async getListStationArea() {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'Stations/getAllStationArea',
                data: {
                    filter: {},
                    skip: 0,
                    limit: 20,
                    order: {
                      key: 'createdAt',
                      value: 'desc',
                    },
                  },
                query: null,
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
    static async updateConfigSMTP(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'Stations/updateConfigSMTP',
                data: { ...data },
                query: null,
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
    static async handleSendTestEmail(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'CustomerMessage/sendTestEmail',
                data: { ...data },
                query: null,
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
    static async handleUpdateConfigSMS(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'Stations/updateConfigSMS',
                data: { ...data },
                query: null,
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
    static async onChangeUseCustomSMSBrand(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'Stations/updateCustomSMSBrand',
                data: { ...data },
                query: null,
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
    static async handleSendTestSMS(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'CustomerMessage/sendTestSMS',
                data: { ...data },
                query: null,
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
    static async fetchAllStationsArea() {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'Stations/getAllStationArea',
                data: null,
                query: null,
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
    static async getStaionById(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'Stations/findById',
                data: data,
                query: null,
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
    static async onChangeAdStatus(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'Stations/enableAdsForStation',
                data: data,
                query: null,
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
    static async getDataStationVNPay(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'Stations/getDetailByStationId',
                data: data,
                query: null,
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
    static async handleInsertOrUpdate(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'StationVNPay/insertOrUpdate',
                data: data,
                query: null,
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
    static async handleUpdateConfigZNS(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'StationVNPay/updateConfigZNS',
                data: data,
                query: null,
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
    static async handleSendTestZNS(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'CustomerMessage/sendTestZNS',
                data: data,
                query: null,
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
    static async handleDelete(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'CustomerSchedule/delete',
                data: data,
                query: null,
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
    static async handleNotification(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'CustomerMessage/sendScheduleMessage',
                data: data,
                query: null,
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
