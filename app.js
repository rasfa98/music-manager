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
app.use('/edit', require('./routes/edit'));
app.use('/delete', require('./routes/delete'));
app.use('/manage', require('./routes/manage'));
app.use('/search', require('./routes/search'));

app.use((req, res) => {
  res.render('404');
});
