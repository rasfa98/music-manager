const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

module.exports.run = () => {
  dotenv.config();

  const app = express();

  app.engine(
    '.hbs',
    handlebars({
      defaultLayout: 'main',
      extname: '.hbs'
    })
  );

  app.set('view engine', '.hbs');

  app.use(express.static(path.join(__dirname, '../public')));
  app.use(bodyParser.urlencoded({ extended: false }));

  const server = app.listen(process.env.PORT, () =>
    console.log(`Server running on PORT: ${process.env.PORT}...`)
  );

  return app;
};
