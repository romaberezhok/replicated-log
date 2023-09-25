;const express = require('express');
const { addMessage, listMessages } = require(`../controllers/${process.env.NODE_TYPE.toLowerCase()}/messages`);


const router = express.Router();

router.get('/', listMessages);
router.post('/', addMessage);

module.exports = router;
