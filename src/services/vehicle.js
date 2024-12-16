import Request from "./request";

export default class VehicleService {
    static async getList() {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'AppUserVehicle/find',
                data: {},
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