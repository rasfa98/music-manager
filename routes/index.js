const router = require('express').Router();

router.route('/').get((req, res) => {
  const db = req.app.get('db');

  db.all('SELECT title, id, band FROM Albums', (err, rows) => {
    if (err) {
      console.log(err);
    }

    res.render('index', { albums: rows });
  });
});

module.exports = router;
