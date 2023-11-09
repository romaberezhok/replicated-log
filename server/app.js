const express = require('express');
const cors = require('cors');
const messagesRouter = require('./routes/messages');
const nodesRouter = require('./routes/nodes');
const { sendRegisterRequest }= require('./helpers/nodeHelpers')

const app = express();
const port = process.env.PORT || 3000;

app.set('trust proxy', true);

app.use(cors());
app.use(express.json());

app.use('/api/messages', messagesRouter);
app.use('/api/nodes', nodesRouter);

app.listen(port, () => {
    console.log(`App is running on port ${port}.`);

    if (process.env.NODE_TYPE !== 'MASTER') {
        sendRegisterRequest();
    }
});