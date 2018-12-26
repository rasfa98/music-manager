const router = require('express').Router();

router.route('/:id').get((req, res) => {
  const db = req.app.get('db');

  const context = {
    album: null,
    tracks: null,
    producers: null
  };

  db.serialize(() => {
    db.all(
      `SELECT * FROM Albums WHERE id = '${req.params.id}'`,
      (err, rows) => {
        if (err) {
          console.log(err);
        }

        context.album = rows[0];
      }
    );

    db.all(
      `SELECT * FROM Tracks WHERE albumId = '${req.params.id}'`,
      (err, rows) => {
        if (err) {
          console.log(err);
        }

        context.tracks = rows;
      }
    );

    db.all(
      `SELECT * FROM Producers WHERE albumId = '${req.params.id}'`,
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
