const router = require('express').Router();

router.route('/').get((req, res) => {
  const db = req.app.get('db');

  db.all(
    `SELECT * FROM Albums WHERE title LIKE '${
      req.query.query
    }%' OR band LIKE '${req.query.query}%'`,
    (err, rows) => {
      if (err) {
        console.log(err);
      }

      res.render('results', { rows: rows });
    }
  );
});

module.exports = router;
