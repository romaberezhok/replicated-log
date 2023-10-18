const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const { getSecondaryNodesURLs, insertIntoSortedArray, pluralizeWord } = require('./common');

const insertMessageIntoHistory = (messages_history, data) => {
    if (process.env.NODE_TYPE === 'MASTER') {
        messages_history.push(data);
        return;
    }

    const { requestId } = data;
    const processedRequestIds = messages_history.map((message) => message.requestId);

    if (!requestId || processedRequestIds.includes(requestId)) {
        throw new Error(`Message ${data.message} with requestId ${requestId} has already been processed.`);
    }

    insertIntoSortedArray(messages_history, data, 'requestId');
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
    const secondaryNodesURLs = await getSecondaryNodesURLs();
    const successfulResponses = [];
    const failedResponses = [];

    const promises = secondaryNodesURLs.map(async (url) => {
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
    const secondaryNodesURLs = await getSecondaryNodesURLs();
    const messages = await Promise.all(secondaryNodesURLs.map((url) => listMessages(url)))
    const response = {};

    for (let i = 0; i < secondaryNodesURLs.length; i++) {
        response[secondaryNodesURLs[i]] = messages[i];
    }

    return response;
};

const waitAllMessagesArrived = async (messages_history) => {
    const checkInterval = 1000;
    const maxRequestId = Math.max(...messages_history.map((message)  => message.requestId), 0);

    return new Promise((resolve) => {
        const checkNoMissedMessages = async () => {
            if (maxRequestId === messages_history.length) {
                resolve(messages_history);
            } else {
                setTimeout(checkNoMissedMessages, checkInterval);
            }
        };
        checkNoMissedMessages();
    });
};

module.exports = {
    insertMessageIntoHistory,
    listMessagesFromSecondaryNodes,
    replicateMessageToSecondaryNodes,
    waitAllMessagesArrived
};
