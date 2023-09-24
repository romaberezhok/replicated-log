const express = require('express');
const messagesRouter = require('./routes/messages');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/messages', messagesRouter);

app.listen(port, () => console.log(`Running on port ${port}.`));