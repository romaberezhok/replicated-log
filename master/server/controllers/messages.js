const axios= require("axios");

const getSecondaryNodesURLs = async () => {
    const {data} = await axios.get("http://service-discovery:8080/api/rawdata");
    return data["services"]["secondary-server-replicated-log@docker"]["loadBalancer"]["servers"].map(obj => obj["url"]);
}

const messages_history = ["First Message"];


const addMessage = async (req, res) => {
    const message = req.body.message;
    const secondaryNodesURLs = await getSecondaryNodesURLs();

    messages_history.push(message);

    try {
        await Promise.all(secondaryNodesURLs.map(url => replicateMessage(message, url)));
        res.status(201).json({
            "message": message,
            "status": `Message has been replicated to ${secondaryNodesURLs.length} secondary nodes.`
        });
    } catch(error) {
        res.status(500).json({
            "message": message,
            "status": `Message couldn't be replicated to the secondary nodes due to the following error: ${error}.`
        });
    }
}



const replicateMessage = async (message, url) => {
    const {data} = await axios.post(`${url}/api/messages`, {"message": message});
    return data;
}

const listMessages = (req, res) => {
    res.status(200).json({"messages": messages_history});
}

module.exports = {
    addMessage,
    listMessages
}