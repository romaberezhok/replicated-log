const express = require('express');
const { addMessage, listMessages, listMessagesFromAllNodes } = require(`../controllers/messageController`);

const router = express.Router();

router.get('/', listMessages);
router.post('/', addMessage);

router.get('/all', listMessagesFromAllNodes);

module.exports = router;
