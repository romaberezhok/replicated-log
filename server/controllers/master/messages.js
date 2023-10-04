const { StatusCodes } = require('http-status-codes');
const { getSecondaryNodesURLs, replicateMessage } = require('./helpers');
const MESSAGES_HISTORY = require('../../db/db');

const addMessage = async (req, res) => {
    const { message, writeConcern } = req.body;
    const secondaryNodesURLs = await getSecondaryNodesURLs();
    const successfulResponses = [];
    const failedResponses = [];

    MESSAGES_HISTORY.push(message);

    const promises = secondaryNodesURLs.map(async (url) => {
        try {
            const response = await replicateMessage(url, message);
            successfulResponses.push(response);

            if (successfulResponses.length >= writeConcern - 1) {
                res.status(StatusCodes.CREATED).json({
                    'message': message,
                    'status': `Message "${message}" has been replicated to at least ${writeConcern} node(s).`
                });
            }
        } catch (error) {
            failedResponses.push(error);
        }
    });

    await Promise.all(promises);

    if (successfulResponses.length < writeConcern - 1) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            'message': message,
            'status': `Message "${message}" was replicated only to ${successfulResponses.length + 1} node(s) but expected ${writeConcern}.`
        });
    }
}

const listMessages = (req, res) => {
    res.status(StatusCodes.OK).json({'messages': MESSAGES_HISTORY});
}

module.exports = {
    addMessage,
    listMessages
}