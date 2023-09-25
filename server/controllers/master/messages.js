const { getSecondaryNodesURLs, replicateMessage } = require('./helpers')
const { MESSAGES_HISTORY } = require('../../db/db')

const addMessage = async (req, res) => {
    const message = req.body.message;
    const secondaryNodesURLs = await getSecondaryNodesURLs();

    MESSAGES_HISTORY.push(message);

    try {
        await Promise.all(secondaryNodesURLs.map((url) => replicateMessage(message, url)));
        res.status(201).json({
            "message": message,
            "status": `Message has been replicated to ${secondaryNodesURLs.length} secondary nodes.`
        });
    } catch (e) {
        res.status(500).json({
            "message": message,
            "status": `Message couldn't be replicated to the secondary nodes due to the following error: "${e}".`
        });
    }
}

const listMessages = (req, res) => {
    res.status(200).json({"messages": MESSAGES_HISTORY});
}

module.exports = {
    addMessage,
    listMessages
}