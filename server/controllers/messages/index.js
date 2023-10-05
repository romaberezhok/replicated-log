const { StatusCodes } = require('http-status-codes');
const {
    getSecondaryNodesURLs,
    replicateMessage,
    insertIntoSortedArray,
    pluralizeWord
} = require('./helpers');
const { BloomFilter } = require('./bloomFilter');
const { MESSAGES_HISTORY } = require('../../db/db');

const bloomFilter = new BloomFilter(100, 5);

const addMessage = async (req, res) => {
    const { createdAt, message, writeConcern } = req.body;

    if (bloomFilter.contains(message)) {
        res.status(StatusCodes.CONFLICT).json({
            message,
            status: `Message "${message}" already exists.`
        });
        return;
    }

    insertIntoSortedArray(MESSAGES_HISTORY,{ createdAt, message }, 'createdAt');

    if (process.env.NODE_TYPE === 'SECONDARY') {
        res.status(StatusCodes.CREATED).json({
            message,
            status: `Message "${message}" has been successfully added.`
        });
        return;
    }

    if (writeConcern === 1) {
        res.status(StatusCodes.CREATED).json({
            message,
            status: `Message "${message}" has been replicated to at least 1 node.`
        });
    }

    bloomFilter.add(message);

    const secondaryNodesURLs = await getSecondaryNodesURLs();
    const successfulResponses = [];
    const failedResponses = [];

    const promises = secondaryNodesURLs.map(async (url) => {
        try {
            const response = await replicateMessage(url, { message, createdAt });
            successfulResponses.push(response);

            if (writeConcern !== 1 && successfulResponses.length >= writeConcern - 1) {
                res.status(StatusCodes.CREATED).json({
                    message,
                    status: `Message "${message}" has been replicated to at least ${writeConcern} ${pluralizeWord('node', 'nodes', writeConcern)}.`
                });
            }
        } catch (error) {
            failedResponses.push(error);
        }
    });

    await Promise.all(promises);

    if (successfulResponses.length + 1 < writeConcern) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message,
            status: `Message "${message}" has been replicated only to ${successfulResponses.length + 1} ${pluralizeWord('node', 'nodes', successfulResponses.length + 1)}, but ${writeConcern} expected.`
        });
    }
}

const listMessages = (req, res) => {
    res.status(StatusCodes.OK).json({messages: MESSAGES_HISTORY.map((message) => message.message)});
}

module.exports = {
    addMessage,
    listMessages
}