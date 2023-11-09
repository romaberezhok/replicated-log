const axios = require('axios');

const sendRegisterRequest = async () => {
    try {
        const { data } = await axios.post('http://master:3000/api/nodes/register');
        console.log('Registration response:', data);
    } catch ({ response, message }) {
        console.error('Error sending registration request:', response?.data || message);
    }
}

module.exports = {
    sendRegisterRequest
}