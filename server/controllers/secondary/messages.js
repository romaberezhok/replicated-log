const { MESSAGES_HISTORY } = require('../../db/db')

const addMessage = async (req, res) => {
    const message = req.body.message;

    MESSAGES_HISTORY.push(message);

    res.status(201).json({
        "message": message,
        "status": `Message "${message}" has been successfully added.`
    });
}

const listMessages = (req, res) => {
    res.status(200).json({'messages': MESSAGES_HISTORY});
}

module.exports = {
    addMessage,
    listMessages
}