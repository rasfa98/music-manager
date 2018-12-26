const express = require('./config/express');
const database = require('./config/database');
const session = require('express-session');

const app = express.run();
const db = database.connect();

app.set('db', db);

app.use(
  session({
    name: 'musicManager',
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 99999999
    }
  })
);

app.use((req, res, next) => {
  res.locals.flash = req.session.flash;

  delete req.session.flash;

  next();
});

app.use('/', require('./routes/index'));
app.use('/add', require('./routes/add'));
app.use('/view', require('./routes/view'));
