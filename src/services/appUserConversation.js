import request from "./request";

const DEFAULT_FILTER = {
    filter: {

    },
    skip: 0,
    limit: 20,
    order: {
        key: "updatedAt",
        value: "desc"
    }
}
class AppUserConversationService {
    async createConversation(data = {
        filter: {

        },
        skip: 0,
        limit: 20,
        order: {
            key: "updatedAt",
            value: "desc"
        }
    }
    ) {
        return request.send({
            method: "post",
            path: "AppUserConversation/insert",
            data,
        });
    }

    async find(data = {
        filter: {

        },
        skip: 0,
        limit: 20,
        order: {
            key: "updatedAt",
            value: "desc"
        }
    }
    ) {
        return request.send({
            method: "post",
            path: "AppUserConversation/find",
            data,
        });
    }

    async readConversation(data = {
        filter: {

        },
        skip: 0,
        limit: 20,
        order: {
            key: "updatedAt",
            value: "desc"
        }
    }) {
        return request.send({
            method: "post",
            path: "AppUserConversation/user/readConversation",
            data,
        });
    }

    async getChatLog(data = {
        filter: {

        },
        skip: 0,
        limit: 20,
        order: {
            key: "updatedAt",
            value: "desc"
        }
    }
    ) {
        return request.send({
            method: "post",
            path: "AppUserChatLog/find",
            data,
        });
    }

    async insertChatLog(data = {
        filter: {

        },
        skip: 0,
        limit: 20,
        order: {
            key: "updatedAt",
            value: "desc"
        }
    }) {
        return request.send({
            method: "post",
            path: "AppUserChatLog/insert",
            data,
        });
    }

    async deleteChatLogById(id) {
        return request.send({
            method: "post",
            path: "AppUserChatLog/deleteById",
            data: {
                id: id
            }
        });
    }

    async markReadedLog(conversationId) {
        return request.send({
            method: "post",
            path: "AppUserConversation/updateById",
            data: {
                id: conversationId,
                data: {
                    senderReadMessage: 1,
                },
            },
        });
    }

    async uploadImage(params) {
        return new Promise((resolve, reject) => {
            request.send({
                method: "POST",
                path: "Upload/uploadMediaFile",
                data: params,
            })
                .then((result) => {
                    const { statusCode, data, message } = result;
                    if (statusCode === 200) {
                        resolve(data);
                    } else {
                        throw new Error(message);
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}

export default new AppUserConversationService();
