module.exports.addAlbum = (db, album, tracks, producers) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN');

      db.run(
        'INSERT INTO Albums (label, device, genre, albumTitle, band, year, albumId) VALUES ($label, $device, $genre, $albumTitle, $band, $year, $albumId)',
        album,
        (db, err) => {
          if (err) {
            db.run('ROLLBACK');
          }
        }
      );

      tracks.forEach(track => {
        db.run(
          'INSERT INTO Tracks (trackName, trackLength, trackId) VALUES ($trackName, $trackLength, $trackId)',
          track,
          (db, err) => {
            if (err) {
              db.run('ROLLBACK');
            }
          }
        );

        db.run(
          'INSERT INTO MadeOf (albumId, trackId) VALUES (?, ?)',
          [album['$albumId'], track['$trackId']],
          (db, err) => {
            if (err) {
              db.run('ROLLBACK');
            }
          }
        );
      });

      producers.forEach(producer => {
        db.run(
          'INSERT INTO Producers (producerName, producerId) VALUES ($producerName, $producerId)',
          producer,
          (db, err) => {
            if (err) {
              db.run('ROLLBACK');
            }
          }
        );

        db.run(
          'INSERT INTO ProducedBy (albumId, producerId) VALUES (?, ?)',
          [album['$albumId'], producer['$producerId']],
          (db, err) => {
            if (err) {
              db.run('ROLLBACK');
            }
          }
        );
      });

      db.run('COMMIT', (db, err) => {
        resolve(db);
      });
    });
  });
};

module.exports.editAlbum = (db, id, album, tracks, producers) => {
  return new Promise((resolve, reject) => {
    album['$albumId'] = id;

    db.serialize(() => {
      db.run('BEGIN');

      db.run(
        'UPDATE Albums SET label = $label, device = $device, genre = $genre, albumTitle = $albumTitle, band = $band, year = $year WHERE albumId = $albumId',
        album,
        (db, err) => {
          if (err) {
            db.run('ROLLBACK');
          }
        }
      );

      db.run('DELETE FROM ProducedBy WHERE albumId = ?', id, (db, err) => {
        if (err) {
          db.run('ROLLBACK');
        }
      });

      db.run('DELETE FROM MadeOf WHERE albumId = ?', id, (db, err) => {
        if (err) {
          db.run('ROLLBACK');
        }
      });

      tracks.forEach(track => {
        db.run(
          'INSERT INTO Tracks (trackName, trackLength, trackId) VALUES ($trackName, $trackLength, $trackId)',
          track,
          (db, err) => {
            if (err) {
              db.run('ROLLBACK');
            }
          }
        );

        db.run(
          'INSERT INTO MadeOf (albumId, trackId) VALUES (?, ?)',
          [id, track['$trackId']],
          (db, err) => {
            if (err) {
              db.run('ROLLBACK');
            }
          }
        );
      });

      producers.forEach(producer => {
        db.run(
          'INSERT INTO Producers (producerName, producerId) VALUES ($producerName, $producerId)',
          producer,
          (db, err) => {
            if (err) {
              db.run('ROLLBACK');
            }
          }
        );

        db.run(
          'INSERT INTO ProducedBy (albumId, producerId) VALUES (?, ?)',
          [id, producer['$producerId']],
          (db, err) => {
            if (err) {
              db.run('ROLLBACK');
            }
          }
        );
      });

      db.run('COMMIT', (db, err) => {
        resolve(db);
      });
    });
  });
};

module.exports.deleteAlbum = (db, id) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN');

      db.run(`DELETE FROM Albums WHERE albumId = ?`, id, (db, err) => {
        if (err) {
          db.run('ROLLBACK');
        }
      });

      db.run(`DELETE FROM ProducedBy WHERE albumId = ?`, id, (db, err) => {
        if (err) {
          db.run('ROLLBACK');
        }
      });

      db.run(`DELETE FROM MadeOf WHERE albumId = ?`, id, (db, err) => {
        if (err) {
          db.run('ROLLBACK');
        }
      });

      db.run('COMMIT', (db, err) => {
        resolve(db);
      });
    });
  });
};

module.exports.getAlbums = (db, sort = '') => {
  return new Promise((resolve, reject) => {
    let sql = 'SELECT albumTitle, albumId, band FROM Albums';

    if (sort === 'length') {
      sql =
        'SELECT Albums.albumId, albumTitle, band FROM Albums, MadeOf INNER JOIN Tracks ON MadeOf.trackId = Tracks.trackId AND MadeOf.albumId = Albums.albumId GROUP BY Albums.albumId ORDER BY SUM(trackLength) DESC';
    } else if (sort === 'mostTracks') {
      sql =
        'SELECT Albums.albumId, albumTitle, band FROM Albums INNER JOIN MadeOf ON MadeOf.albumId = Albums.albumId GROUP BY Albums.albumId ORDER BY COUNT(MadeOf.trackId) DESC';
    } else if (sort === 'fewestTracks') {
      sql =
        'SELECT Albums.albumId, albumTitle, band FROM Albums INNER JOIN MadeOf ON MadeOf.albumId = Albums.albumId GROUP BY Albums.albumId ORDER BY COUNT(MadeOf.trackId)';
    }

    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      }

      resolve(rows);
    });
  });
};

module.exports.searchAlbum = (db, query) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT albumTitle, band, albumId FROM Albums WHERE albumTitle LIKE '${query}%' OR band LIKE '${query}%'`,
      (err, rows) => {
        if (err) {
          reject(err);
        }

        resolve(rows);
      }
    );
  });
};

module.exports.getAlbum = (db, id) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT Albums.albumId, albumTitle, band, genre, year, label, device,
            GROUP_CONCAT(DISTINCT producerName) AS producers,
            GROUP_CONCAT(DISTINCT trackName) AS trackNames,
            GROUP_CONCAT(DISTINCT trackLength) AS trackLengths,
            COUNT(DISTINCT trackName) AS numberOfTracks,
            SUM(DISTINCT trackLength) AS albumLength FROM Albums, ProducedBy, MadeOf
            INNER JOIN Producers ON Producers.producerId = ProducedBy.producerId
            INNER JOIN Tracks ON Tracks.trackId = MadeOf.trackId
            WHERE Albums.albumId = ? AND ProducedBy.albumId = ? AND MadeOf.albumId = ?`,
      [id, id, id],
      (err, rows) => {
        if (err) {
          reject(err);
        }

        resolve(rows[0]);
      }
    );
  });
};
