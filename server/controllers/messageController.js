const { StatusCodes } = require('http-status-codes');
const { insertMessageIntoHistory, replicateMessageToSecondaryNodes } = require('../helpers/messageHelpers');
const { getRandomNumber } = require('../helpers/common');
const { BloomFilter } = require('../helpers/bloomFilter');
const { MESSAGES_HISTORY } = require('../db/db');

const bloomFilter = new BloomFilter(300, 5);

const addMessage = async (req, res) => {
    const { createdAt, message, writeConcern } = req.body;

    if (process.env.NODE_TYPE === 'MASTER') {
        return await handleMasterFlow(res, message, createdAt, writeConcern);
    }

    return await handleSecondaryFlow(res, message, createdAt);
};

const handleMasterFlow = async (res, message, createdAt, writeConcern) => {
    if (bloomFilter.contains(message)) {
        return res.status(StatusCodes.CONFLICT).json({
            message,
            status: `Message "${message}" already exists.`
        });
    }

    insertMessageIntoHistory(MESSAGES_HISTORY, { createdAt, message });

    bloomFilter.add(message);

    if (writeConcern === 1) {
        res.status(StatusCodes.CREATED).json({
            message,
            status: `Message "${message}" has been replicated to at least 1 node.`
        });
    }

    await replicateMessageToSecondaryNodes(res, { message, createdAt }, writeConcern);
}

const handleSecondaryFlow = async (res, message, createdAt) => {
    setTimeout(() => {
        insertMessageIntoHistory(MESSAGES_HISTORY, { createdAt, message });
        res.status(StatusCodes.CREATED).json({
            message,
            status: `Message "${message}" has been successfully added.`
        })
    }, getRandomNumber(parseInt(process.env.MIN_RESPONSE_DELAY), parseInt(process.env.MAX_RESPONSE_DELAY)) * 1000);
}

const listMessages = (req, res) => {
    res.status(StatusCodes.OK).json({messages: MESSAGES_HISTORY.map((message) => message.message)});
}

module.exports = {
    addMessage,
    listMessages
}
