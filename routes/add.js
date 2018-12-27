const router = require('express').Router();
const uniqid = require('uniqid');

router
  .route('/')
  .get((req, res) => {
    res.render('add');
  })
  .post((req, res) => {
    const db = req.app.get('db');
    const data = req.body;
    const producers = data.producer.split(',');
    const id = uniqid();

    db.serialize(() => {
      db.run(
        'INSERT INTO Albums (label, device, genre, title, band, year, id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        data.label,
        data.device,
        data.genre,
        data.title,
        data.band,
        data.year,
        id
      );

      if (Array.isArray(data.track)) {
        for (let i = 0; i < data.track.length; i++) {
          db.run(
            'INSERT INTO Tracks (name, length, trackNr, albumId) VALUES (?, ?, ?, ?)',
            data.track[i],
            data.length[i],
            i + 1,
            id
          );
        }
      } else {
        db.run(
          'INSERT INTO Tracks (name, length, trackNr, albumId) VALUES (?, ?, ?, ?)',
          data.track,
          data.length,
          1,
          id
        );
      }

      let stmt = 'INSERT INTO Producers (name, albumId) VALUES ';
      const rowData = [];

      for (let i = 0; i < producers.length; i++) {
        rowData.push(producers[i], id);
        stmt += '(?, ?)';
      }

      stmt = stmt.slice(0, stmt.length - 1);

      db.run(stmt, rowData, () => {
        req.session.flash = {
          type: 'success',
          message: 'Album was successfully added!'
        };

        res.redirect('/');
      });
    });
  });

module.exports = router;
