import Request from "./request";

export default class ThirdPartyIntegration {
    static async updateConfigsTelegram(data, newToken) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'ThirdPartyIntegration/advanceUser/updateConfigsTelegram',
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