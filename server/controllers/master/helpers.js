const axios = require('axios');

const getSecondaryNodesURLs = async () => {
    try {
        const { data } = await axios.get('http://service-discovery:8080/api/rawdata');
        return data['services']['secondary-server-replicated-log@docker']['loadBalancer']['servers'].map((obj) => obj['url']);
    } catch (error) {
        throw new Error('Failed to get URLs of secondary nodes.')
    }
}

const replicateMessage = async (url, message) => {
    try {
        return await axios.post(`${url}/api/messages`, {'message': message});
    } catch (error) {
        throw new Error(`Failed to replicate "${message}" message to ${url}.`)
    }
}

module.exports = {
    getSecondaryNodesURLs,
    replicateMessage
}