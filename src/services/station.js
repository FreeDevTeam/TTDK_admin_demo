import Request from "./request";

export default class SationService {
    static async getList(data) {
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
    static async getListStation() {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'Stations/find',
                data: {
                    filter: {},
                    skip: 0,
                    limit: 500,
                  },
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
