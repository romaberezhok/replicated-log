const express = require('express');
const cors = require('cors');
const messagesRouter = require('./routes/messages');

const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use('/api/messages', messagesRouter);

app.listen(port, () => console.log(`App is running on port ${port}.`));