
const { StatusCodes } = require('http-status-codes');
const { insertMessageIntoHistory, replicateMessageToSecondaryNodes } = require('../helpers/messageHelpers');
const { BloomFilter } = require('../helpers/bloomFilter');
const { MESSAGES_HISTORY } = require('../db/db');

const bloomFilter = new BloomFilter(300, 5);

const addMessage = async (req, res) => {
    const { createdAt, message, writeConcern } = req.body;

    if (bloomFilter.contains(message)) {
        return res.status(StatusCodes.CONFLICT).json({
            message,
            status: `Message "${message}" already exists.`
        });
    }

    insertMessageIntoHistory(MESSAGES_HISTORY, { createdAt, message });

    bloomFilter.add(message);

    if (process.env.NODE_TYPE === 'SECONDARY') {
        return res.status(StatusCodes.CREATED).json({
            message,
            status: `Message "${message}" has been successfully added.`
        });
    }

    if (writeConcern === 1) {
        res.status(StatusCodes.CREATED).json({
            message,
            status: `Message "${message}" has been replicated to at least 1 node.`
        });
    }

    await replicateMessageToSecondaryNodes(res, { message, createdAt }, writeConcern);
};

const listMessages = (req, res) => {
    res.status(StatusCodes.OK).json({messages: MESSAGES_HISTORY.map((message) => message.message)});
}

module.exports = {
    addMessage,
    listMessages
}
