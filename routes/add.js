const router = require('express').Router();

router
  .route('/')
  .get((req, res) => {
    res.render('add');
  })
  .post((req, res) => {
    const db = req.app.get('db');
    const data = req.body;
    const producers = data.producer.split(',');

    db.serialize(() => {
      db.run(
        'INSERT INTO Albums (label, device, genre, albumTitle, band, year) VALUES (?, ?, ?, ?, ?, ?)',
        data.label,
        data.device,
        data.genre,
        data.title,
        data.band,
        data.year
      );

      if (Array.isArray(data.track)) {
        for (let i = 0; i < data.track.length; i++) {
          db.run(
            'INSERT INTO Tracks (name, length, albumTitle, band, trackNr) VALUES (?, ?, ?, ?, ?)',
            data.track[i],
            data.length[i],
            data.title,
            data.band,
            i + 1
          );
        }
      } else {
        db.run(
          'INSERT INTO Tracks (name, length, albumTitle, band, trackNr) VALUES (?, ?, ?, ?, ?)',
          data.track,
          data.length,
          data.title,
          data.band,
          1
        );
      }

      for (let i = 0; i < producers.length; i++) {
        db.run(
          'INSERT INTO Producers (name, albumTitle, band) VALUES (?, ?, ?)',
          producers[i],
          data.title,
          data.band,
          () => {
            req.session.flash = {
              type: 'success',
              message: 'Album was successfully added!'
            };

            res.redirect('/');
          }
        );
      }
    });
  });

module.exports = router;
