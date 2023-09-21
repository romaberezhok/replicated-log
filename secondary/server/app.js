const express = require('express');
const messagesRouter = require('./routes/messages');

const app = express();
const port = process.env.PORT || 3001;
const host = process.env.HOST ||'0.0.0.0';

app.use(express.json());
app.use('/api/messages', messagesRouter);

app.listen(port, host, () => console.log(`Running on http://${host}:${port}.`));