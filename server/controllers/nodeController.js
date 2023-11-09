const { StatusCodes } = require('http-status-codes');
const { SECONDARY_NODES_URLS } = require('../db/db');

const registerSecondaryNode = async (req, res) => {
    const ipv4 = req.ip.split(':').pop();

    SECONDARY_NODES_URLS.push(`http://${ipv4}:3000`);

    res.status(StatusCodes.CREATED).json({status: `Node with IP ${ipv4} has been registered.`});
}

module.exports = {
    registerSecondaryNode
}