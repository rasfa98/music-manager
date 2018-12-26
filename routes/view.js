const router = require('express').Router();

router.route('/').get((req, res) => {
  const db = req.app.get('db');

  const context = {
    album: null,
    tracks: null,
    producers: null
  };

  db.serialize(() => {
    db.all(
      `SELECT * FROM Albums WHERE albumTitle = '${
        req.query.albumTitle
      }' AND band = '${req.query.band}'`,
      (err, rows) => {
        if (err) {
          console.log(err);
        }

        context.album = rows[0];
      }
    );

    db.all(
      `SELECT * FROM Tracks WHERE albumTitle = '${
        req.query.albumTitle
      }' AND band = '${req.query.band}'`,
      (err, rows) => {
        if (err) {
          console.log(err);
        }

        context.tracks = rows;
      }
    );

    db.all(
      `SELECT * FROM Producers WHERE albumTitle = '${
        req.query.albumTitle
      }' AND band = '${req.query.band}'`,
      (err, rows) => {
        if (err) {
          console.log(err);
        }

        context.producers = rows;

        res.render('view', context);
      }
    );
  });
});

module.exports = router;
