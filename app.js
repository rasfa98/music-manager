const express = require('./config/express');

const app = express.run();

app.use('/', require('./routes/index'));
app.use('/add', require('./routes/add'));
