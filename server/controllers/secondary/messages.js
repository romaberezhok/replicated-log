const { StatusCodes } = require('http-status-codes');
const MESSAGES_HISTORY = require('../../db/db');

const addMessage = async (req, res) => {
    const message = req.body.message;

    MESSAGES_HISTORY.push(message);

    res.status(StatusCodes.CREATED).json({
        "message": message,
        "status": `Message "${message}" has been successfully added.`
    });
}

const listMessages = (req, res) => {
    res.status(StatusCodes.OK).json({'messages': MESSAGES_HISTORY});
}

module.exports = {
    addMessage,
    listMessages
}