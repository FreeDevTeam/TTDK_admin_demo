import Request from "./request";

export default class NotificationService {
    static async getList(data, newToken) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'StaffNotification/find',
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
    static async deleteNotificationById(id) {
        return Request.send({
            method: "POST",
            path: "StaffNotification/deleteById",
            data: {
                id: id
            }
        });
    }
    static async update(data, newToken) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'StaffNotification/insert',
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
    static async uploadImage(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'Upload/uploadMediaFile',
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
    static async getDetailById(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'StaffNotification/findById',
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
    static async handleUpdate(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'StaffNotification/updateById',
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
    static async insertNotification(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'StaffNotification/insert',
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
}