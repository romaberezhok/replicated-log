const express = require('express');
const { registerSecondaryNode } = require(`../controllers/nodeController`);

const router = express.Router();

router.post('/register', registerSecondaryNode);

module.exports = router;
