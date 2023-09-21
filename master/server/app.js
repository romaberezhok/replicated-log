const express = require('express');
const messagesRouter = require('./routes/messages');


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', messagesRouter);

app.listen(port, () => console.log(`Server is listening port ${port}...`));