;const express = require('express');
const {addMessage, listMessages} = require('../controllers/messages');


const router = express.Router();

router.get('/', listMessages);
router.post('/', addMessage);

module.exports = router;
