const router = require('express').Router();

router.route('/').get((req, res) => {
  const db = req.app.get('db');

  db.all('SELECT * FROM Albums', (err, rows) => {
    if (err) {
      console.log(err);
    }

    res.render('manage', { albums: rows });
  });
});

module.exports = router;
