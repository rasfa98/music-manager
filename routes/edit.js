const router = require('express').Router();

router
  .route('/:id')
  .get((req, res) => {
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

          const producers = [];

          rows.forEach(row => {
            producers.push(row.name);
          });

          context.producers = producers.join(', ');

          res.render('edit', context);
        }
      );
    });
  })
  .post((req, res) => {
    const db = req.app.get('db');
    const data = req.body;
    const producers = data.producer.split(',');

    db.serialize(() => {
      db.run(
        `UPDATE Albums SET label = ?, device = ?, genre = ?, title = ?, band = ?, year = ? WHERE id = '${
          req.params.id
        }'`,
        data.label,
        data.device,
        data.genre,
        data.title,
        data.band,
        data.year
      );

      db.run(`DELETE FROM Tracks WHERE albumId = '${req.params.id}'`);
      db.run(`DELETE FROM Producers WHERE albumId = '${req.params.id}'`);

      if (Array.isArray(data.track)) {
        for (let i = 0; i < data.track.length; i++) {
          db.run(
            'INSERT INTO Tracks (name, length, trackNr, albumId) VALUES (?, ?, ?, ?)',
            data.track[i],
            data.length[i],
            i + 1,
            req.params.id
          );
        }
      } else {
        db.run(
          'INSERT INTO Tracks (name, length, trackNr, albumId) VALUES (?, ?, ?, ?)',
          data.track,
          data.length,
          1,
          req.params.id
        );
      }

      let stmt = 'INSERT INTO Producers (name, albumId) VALUES ';
      const rowData = [];

      for (let i = 0; i < producers.length; i++) {
        rowData.push(producers[i], req.params.id);
        stmt += '(?, ?),';
      }

      stmt = stmt.slice(0, stmt.length - 1);

      db.run(stmt, rowData, () => {
        req.session.flash = {
          type: 'success',
          message: 'Album has been updated.'
        };

        res.redirect('back');
      });
    });
  });

module.exports = router;
