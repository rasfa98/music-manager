const express = require('./config/express');
const database = require('./config/database');

const app = express.run();
const db = database.connect();

app.set('db', db);

app.use('/', require('./routes/index'));
app.use('/add', require('./routes/add'));
