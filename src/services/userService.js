import Request from "./request";

export default class UserService {
  static async getUser(params = {}) {
    return new Promise((resolve, reject) => {
      Request.send({
        method: "POST",
        path: "/AppUsers/find",
        data: params,
      }).then((result) => {
        const { statusCode, data, error } = result;
        if (statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(error));
        }
      }).catch(error => {
        reject(error);
      });
    });
  }

  static async findDetailUserById(id) {
    return new Promise((resolve, reject) => {
      Request.send({
        method: "POST",
        path: "/AppUsers/findById",
        data: {
          id: id,
        },
      }).then((result = {}) => {
        const { statusCode, data, message } = result;
        if (statusCode === 200) {
          return resolve(data);
        } else {
          return reject(message);
        }
      });
    });
  }

  static async updateUserById(params) {
    return new Promise((resolve, reject) => {
      Request.send({
        method: "POST",
        path: "/AppUsers/updateUserById",
        data: params,
      }).then((result) => {
        const { statusCode, error } = result;
        if (statusCode === 200) {
          return resolve();
        } else {
          reject(new Error(error));
        }
      }).catch(error => {
        reject(error);
      });
    });
  }

  static async verifyInfoUser(params) {
    return new Promise((resolve, reject) => {
      Request.send({
        method: "POST",
        path: "/AppUsers/verifyInfoUser",
        data: params,
      }).then((result) => {
        const { statusCode, error } = result;
        if (statusCode === 200) {
          return resolve();
        } else {
          reject(new Error(error));
        }
      }).catch(error => {
        reject(error);
      });
    });
  }

  static async rejectInfoUser(params) {
    return new Promise((resolve, reject) => {
      Request.send({
        method: "POST",
        path: "/AppUsers/rejectInfoUser",
        data: params,
      }).then((result) => {
        const { statusCode, error } = result;
        if (statusCode === 200) {
          return resolve();
        } else {
          reject(new Error(error));
        }
      }).catch(error => {
        reject(error);
      });
    });
  }

  static async uploadAvatar(params) {
    return new Promise((resolve, reject) => {
      Request.send({
        method: "POST",
        path: "/AppUsers/uploadAvatar",
        data: params,
      }).then((result) => {
        const { statusCode, data, error } = result;
        if (statusCode === 200) {
          return resolve(data);
        } else {
          reject(new Error(error));
        }
      }).catch(error => {
        reject(error);
      });
    });
  }

  static async exportExcel(params) {
    return new Promise((resolve, reject) => {
      Request.send({
        method: "POST",
        path: "/AppUsers/exportExcel",
        data: params,
      }).then((result) => {
        const { statusCode, data, error } = result;
        if (statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(error));
        }
      }).catch(error => {
        reject(error);
      });
    });
  }

  static async adminChangePasswordUser(params) {
    return new Promise((resolve, reject) => {
      Request.send({
        method: "POST",
        path: "/AppUsers/adminChangePasswordUser",
        data: params,
      }).then((result) => {
        const { statusCode, data, error } = result;
        if (statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(error));
        }
      }).catch(error => {
        reject(error);
      });
    });
  }

  static async adminChangeSecondaryPasswordUser(params) {
    return new Promise((resolve, reject) => {
      Request.send({
        method: "POST",
        path: "/AppUsers/adminChangeSecondaryPasswordUser",
        data: params,
      }).then((result) => {
        const { statusCode, data, error } = result;
        if (statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(error));
        }
      }).catch(error => {
        reject(error);
      });
    });
  }

  static async findAllUsersFollowingReferId(params = {}) {
    return new Promise((resolve, reject) => {
      Request.send({
        method: "POST",
        path: "/AppUsers/findAllUsersFollowingReferId",
        data: params,
      }).then((result) => {
        const { statusCode, data, error } = result;
        if (statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(error));
        }
      }).catch(error => {
        reject(error);
      });
    });
  }

  static async getListReferralByUserId(params = {}) {
    return new Promise((resolve, reject) => {
      Request.send({
        method: "POST",
        path: "/PaymentServicePackage/admin/getListReferralByUserId",
        data: params,
      }).then((result) => {
        const { statusCode, data, error } = result;
        if (statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(error));
        }
      }).catch(error => {
        reject(error);
      });
    });
  }
}
