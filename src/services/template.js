import Request from "./request";

export default class TemplateService {
    static async getList(data, newToken) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'MessageTemplate/find',
                data: { ...data },
                query: null,
                headers: {
                    Authorization: `Bearer ` + newToken,
                },
            }).then((result = {}) => {
                const { statusCode } = result
                if (statusCode === 200) {
                    return resolve(result)
                } else {
                    return resolve(result)
                }
            })
        })
    }
}