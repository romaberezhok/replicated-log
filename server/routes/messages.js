const express = require('express');
const { addMessage, listMessages } = require(`../controllers/messageController`);

const router = express.Router();

router.get('/', listMessages);
router.post('/', addMessage);

module.exports = router;
