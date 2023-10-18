const { StatusCodes } = require('http-status-codes');
const { insertMessageIntoHistory, replicateMessageToSecondaryNodes , waitAllMessagesArrived} = require('../helpers/messageHelpers');
const { getRandomNumber } = require('../helpers/common');
const { MESSAGES_HISTORY } = require('../db/db');

let requestCount = 1;

const addMessage = async (req, res) => {
    const { message, writeConcern, requestId } = req.body;

    if (process.env.NODE_TYPE === 'MASTER') {
        return await handleMasterFlow(res, message, writeConcern);
    }

    return await handleSecondaryFlow(res, message, requestId);
};

const handleMasterFlow = async (res, message, writeConcern) => {

    insertMessageIntoHistory(MESSAGES_HISTORY, { message });

    if (writeConcern === 1) {
        res.status(StatusCodes.CREATED).json({
            message,
            status: `Message "${message}" has been replicated to at least 1 node.`
        });
    }

    await replicateMessageToSecondaryNodes(res, { message, requestId: requestCount++ }, writeConcern);
}

const handleSecondaryFlow = async (res, message, requestId) => {
    setTimeout(() => {
        insertMessageIntoHistory(MESSAGES_HISTORY, { message, requestId: requestId });
        res.status(StatusCodes.CREATED).json({
            message,
            status: `Message "${message}" has been successfully added.`
        })
    }, getRandomNumber(parseInt(process.env.MIN_RESPONSE_DELAY), parseInt(process.env.MAX_RESPONSE_DELAY)) * 1000);
}

const listMessages = async (req, res) => {
    const messages_history = process.env.NODE_TYPE === 'MASTER' ? MESSAGES_HISTORY : await waitAllMessagesArrived(MESSAGES_HISTORY);

    res.status(StatusCodes.OK).json({messages: messages_history.map((message) => message.message)});
}

const listMessagesFromAllNodes = async (req, res) => {
    if (process.env.NODE_TYPE !== 'MASTER') {
        return res.status(StatusCodes.NOT_FOUND).json({status: 'The requested URL was not found on this server.'})
    }



}

module.exports = {
    addMessage,
    listMessages
}
