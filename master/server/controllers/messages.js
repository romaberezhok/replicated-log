const MESSAGES_HISTORY = ["First Message"];

const addMessage = (req, res) => {
    const message = req.body.message;

    MESSAGES_HISTORY.push(message);

    res.status(201).json({
        "message": message
    });
}

const listMessages = (req, res) => {
    res.status(200).json({"messages": MESSAGES_HISTORY});
}

module.exports = {
    addMessage,
    listMessages
}