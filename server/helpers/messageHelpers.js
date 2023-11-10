const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const {
    extractIPFromURL,
    insertIntoSortedArray,
    pluralizeWord
} = require('./common');

const { MESSAGES_HISTORY, SECONDARY_NODES_URLS } = require('../db/db');

const insertMessageIntoHistory = (messagesHistory, data) => {
    if (process.env.NODE_TYPE === 'MASTER') {
        messagesHistory.push(data);
        return;
    }

    const { requestId } = data;
    const processedRequestIds = messagesHistory.map((message) => message.requestId);

    if (!requestId || processedRequestIds.includes(requestId)) {
        throw new Error(`Message ${data.message} with requestId ${requestId} has already been processed.`);
    }

    insertIntoSortedArray(messagesHistory, data, 'requestId');
};

const replicateMessage = async (url, data) => {
    try {
        return await axios.post(`${url}/api/messages`, data);
    } catch (error) {
        throw new Error(`Failed to replicate "${data.message}" message to ${url}.`);
    }
}

const listMessages = async (url) => {
    try {
        const { data } = await axios.get(`${url}/api/messages`);
        return data.messages;
    } catch (error) {
        throw new Error(`Failed to list messages from ${url}.`);
    }
}

const replicateMessageToSecondaryNodes = async (res, data, writeConcern) => {
    const successfulResponses = [];
    const failedResponses = [];

    const promises = SECONDARY_NODES_URLS.map(async (url) => {
        try {
            const response = await replicateMessage(url, data);
            successfulResponses.push(response);

            if (writeConcern !== 1 && successfulResponses.length + 1 >= writeConcern) {
                res.status(StatusCodes.CREATED).json({
                    message: data.message,
                    status: `Message "${data.message}" has been replicated to at least ${writeConcern} ${pluralizeWord('node', 'nodes', writeConcern)}.`
                });
            }
        } catch (error) {
            failedResponses.push(error);
        }
    });

    await Promise.all(promises);

    if (successfulResponses.length + 1 < writeConcern) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: data.message,
            status: `Message "${data.message}" has been replicated only to ${successfulResponses.length + 1} ${pluralizeWord('node', 'nodes', successfulResponses.length + 1)}, but ${writeConcern} expected.`
        });
    }
};

const listMessagesFromSecondaryNodes = async () => {
    const messages = await Promise.all(SECONDARY_NODES_URLS.map((url) => listMessages(url)))
    const response = {};

    for (let i = 0; i < SECONDARY_NODES_URLS.length; i++) {
        response[extractIPFromURL(SECONDARY_NODES_URLS[i])] = messages[i];
    }

    return response;
};

const waitAllMessagesArrived = async (messagesHistory) => {
    const checkInterval = 1000;
    const maxRequestId = Math.max(...messagesHistory.map((message)  => message.requestId), 0);

    return new Promise((resolve) => {
        const checkNoMissedMessages = async () => {
            if (maxRequestId === messagesHistory.length) {
                resolve(messagesHistory);
            } else {
                setTimeout(checkNoMissedMessages, checkInterval);
            }
        };
        checkNoMissedMessages();
    });
};

const syncMessagesHistoryFromMaster = async () => {
    try {
        const { data } = await axios.get('http://master:3000/api/messages');

        MESSAGES_HISTORY.push(
            ...data.messages.map((message, index) => ({message, requestId: index + 1}))
        );

        console.log('Messages have been synchronized from the master node:', MESSAGES_HISTORY);
    } catch ({ response, message }) {
            console.error('Error synchronizing data from the master:', response?.data || message);
            throw new Error('Failed to synchronize history from the master node.');
    }
};

module.exports = {
    insertMessageIntoHistory,
    listMessagesFromSecondaryNodes,
    replicateMessageToSecondaryNodes,
    syncMessagesHistoryFromMaster,
    waitAllMessagesArrived
};
