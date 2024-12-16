import Request from "./request";

export default class SystemConfigurationsService {
  static async getPublicSystemConfigurations(data, newToken) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'SystemConfigurations/user/getPublicSystemConfigurations',
        data: { ...data },
        query: null,
        headers: {
          Authorization: `Bearer ` + newToken,
        },
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
  static async updateById(data) {
    return new Promise((resolve) => {
      Request.send({
        method: "POST",
        path: "SystemConfigurations/updateById",
        data: data,
        query: null,
      }).then((result = {}) => {
        let { statusCode } = result;
        if (statusCode === 200) {
          return resolve({ isSuccess: true })
        } else {
          return resolve({ isSuccess: false })
        }
      })
    });
  }
}