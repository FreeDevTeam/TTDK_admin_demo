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
    static async getListStaffPatern() {
        return new Promise((resolve, reject) => {
            Request.send({
                method: "POST",
                path: "AppUsers/getListStationUser",
                data: {
                    "filter": {
                      "appUserRoleId": 1
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
    static async getListStaffTechnician() {
        return new Promise((resolve, reject) => {
            Request.send({
                method: "POST",
                path: "AppUsers/getListStationUser",
                data: {
                    "filter": {
                      "appUserRoleId": 2
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
    static async getListStaffHigh() {
        return new Promise((resolve, reject) => {
            Request.send({
                method: "POST",
                path: "AppUsers/getListStationUser",
                data: {
                    "filter": {
                      "appUserRoleId": 3
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
    static async getListStaffAccount() {
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