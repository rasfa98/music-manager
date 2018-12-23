const express = require('./config/express');

const app = express.run();

app.use('/', require('./routes/index'));
