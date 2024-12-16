import Request from "./request";

export default class tabStaffService {
    static async getListStaff(params = {}) {
        return new Promise((resolve, reject) => {
            Request.send({
                method: "POST",
                path: "Staff/find",
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

  
}