;const express = require('express');
const {addMessage, listMessages} = require('../../controllers/messages');


const router = express.Router();

router.get('/messages', listMessages);
router.post('/messages', addMessage);

module.exports = router;
