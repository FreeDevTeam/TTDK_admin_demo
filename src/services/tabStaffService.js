import Request from "./request";

export default class tabStaffService {
    static async getListStaff(params = {}) {
        return new Promise((resolve, reject) => {
            Request.send({
                method: "POST",
                path: "AppUsers/getListStationUser",
                data: params,
            }).then((result) => {
                const { statusCode, data, error } = result;
                if (statusCode === 200) {
                    resolve(result);
                } else {
                    reject(new Error(error));
                }
            }).catch(error => {
                reject(error);
            });
        });
    }
    static async getListStaffPatern(data) {
        return new Promise((resolve, reject) => {
            Request.send({
                method: "POST",
                path: "AppUsers/getListStationUser",
                data: data,
            }).then((result) => {
                const { statusCode, data, error } = result;
                if (statusCode === 200) {
                    resolve(result);
                } else {
                    reject(new Error(error));
                }
            }).catch(error => {
                reject(error);
            });
        });
    }
    static async getListStaffTechnician(data) {
        return new Promise((resolve, reject) => {
            Request.send({
                method: "POST",
                path: "AppUsers/getListStationUser",
                data: data,
            }).then((result) => {
                const { statusCode, data, error } = result;
                if (statusCode === 200) {
                    resolve(result);
                } else {
                    reject(new Error(error));
                }
            }).catch(error => {
                reject(error);
            });
        });
    }
    static async getListStaffHigh(data) {
        return new Promise((resolve, reject) => {
            Request.send({
                method: "POST",
                path: "AppUsers/getListStationUser",
                data: data,
            }).then((result) => {
                const { statusCode, data, error } = result;
                if (statusCode === 200) {
                    resolve(result);
                } else {
                    reject(new Error(error));
                }
            }).catch(error => {
                reject(error);
            });
        });
    }
    static async getListStaffAccount(data) {
        return new Promise((resolve, reject) => {
            Request.send({
                method: "POST",
                path: "AppUsers/getListStationUser",
                data: {
                    "filter": {
                      "appUserRoleId": 5
                    }
                  },
            }).then((result) => {
                const { statusCode, data, error } = result;
                if (statusCode === 200) {
                    resolve(result);
                } else {
                    reject(new Error(error));
                }
            }).catch(error => {
                reject(error);
            });
        });
    }
  
}