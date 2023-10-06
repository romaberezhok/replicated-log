const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const { getSecondaryNodesURLs, insertIntoSortedArray, pluralizeWord } = require('./common');

const insertMessageIntoHistory = (messages_history, data) => {
    insertIntoSortedArray(messages_history, data, 'createdAt');
};

const replicateMessage = async (url, data) => {
    try {
        return await axios.post(`${url}/api/messages`, data);
    } catch (error) {
        throw new Error(`Failed to replicate "${data.message}" message to ${url}.`)
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

module.exports = {
    insertMessageIntoHistory,
    replicateMessageToSecondaryNodes
};
