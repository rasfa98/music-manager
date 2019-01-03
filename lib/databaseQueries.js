module.exports.addAlbum = (db, album) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO Albums (label, device, genre, title, band, year, id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      album,
      (db, err) => {
        if (err) {
          reject(err);
        }

        resolve(db);
      }
    );
  });
};

module.exports.addTrack = (db, track) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO Tracks (name, length, trackNr, albumId) VALUES (?, ?, ?, ?)',
      track,
      (db, err) => {
        if (err) {
          reject(err);
        }

        resolve(db);
      }
    );
  });
};

module.exports.addProducer = (db, producer) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO Producers (name, albumId) VALUES (?, ?)',
      producer,
      (db, err) => {
        if (err) {
          reject(err);
        }

        resolve(db);
      }
    );
  });
};

module.exports.deleteAlbum = (db, id) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`DELETE FROM Albums WHERE id = '${id}'`);
      db.run(`DELETE FROM Tracks WHERE albumId = '${id}'`);
      db.run(`DELETE FROM Producers WHERE albumId = '${id}'`, (db, err) => {
        if (err) {
          reject(err);
        }

        resolve(db);
      });
    });
  });
};

module.exports.deleteTracksAndProducers = (db, id) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`DELETE FROM Tracks WHERE albumId = '${id}'`);
      db.run(`DELETE FROM Producers WHERE albumId = '${id}'`, (db, err) => {
        if (err) {
          reject(err);
        }

        resolve(db);
      });
    });
  });
};

module.exports.getAlbums = (db, sort = '') => {
  return new Promise((resolve, reject) => {
    let sql = 'SELECT title, id, band, device FROM Albums';

    if (sort === 'length') {
      sql =
        'SELECT id, title, band FROM Albums INNER JOIN Tracks ON id = albumId GROUP BY albumId ORDER BY SUM(length) DESC';
    } else if (sort === 'mostTracks') {
      sql =
        'SELECT id, title, band FROM Albums INNER JOIN Tracks ON id = albumId GROUP BY albumId ORDER BY COUNT(albumId) DESC';
    } else if (sort === 'fewestTracks') {
      sql =
        'SELECT id, title, band FROM Albums INNER JOIN Tracks ON id = albumId GROUP BY albumId ORDER BY COUNT(albumId)';
    }

    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      }

      return resolve(rows);
    });
  });
};

module.exports.searchAlbum = (db, query) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM Albums WHERE title LIKE '${query}%' OR band LIKE '${query}%'`,
      (err, rows) => {
        if (err) {
          reject(err);
        }

        resolve(rows);
      }
    );
  });
};

module.exports.getAllAlbumDetails = (db, id) => {
  return new Promise((resolve, reject) => {
    const context = {
      album: null,
      tracks: []
    };

    db.all(
      `SELECT id, title, band, genre, year, label, device,
            GROUP_CONCAT(DISTINCT Producers.name) AS producers,
            GROUP_CONCAT(DISTINCT Tracks.name) AS trackNames,
            GROUP_CONCAT(DISTINCT length) AS trackLengths,
            GROUP_CONCAT(DISTINCT trackNr) AS trackNumbers,
            COUNT(DISTINCT Tracks.name) AS numberOfTracks,
            SUM(DISTINCT length) AS albumLength FROM Albums
            INNER JOIN Producers ON Producers.albumId = id
            INNER JOIN Tracks ON Tracks.albumId = id
            WHERE id = '${id}'`,
      (err, rows) => {
        if (err) {
          reject(err);
        }

        const album = rows[0];

        const trackNames = album.trackNames.split(',');
        const trackLengths = album.trackLengths.split(',');
        const trackNumbers = album.trackNumbers.split(',');

        context.album = album;
        context.album.producers = album.producers.split(',').join(', ');

        delete context.album.trackNames;
        delete context.album.trackLengths;
        delete context.album.trackNumbers;

        for (let i = 0; i < trackNames.length; i++) {
          context.tracks.push({
            name: trackNames[i],
            length: trackLengths[i],
            nr: trackNumbers[i]
          });
        }

        resolve(context);
      }
    );
  });
};

module.exports.updateAlbum = (db, id, data) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE Albums SET label = ?, device = ?, genre = ?, title = ?, band = ?, year = ? WHERE id = '${id}'`,
      data,
      (db, err) => {
        if (err) {
          reject(err);
        }

        resolve(db);
      }
    );
  });
};

module.exports.removeTracksAndProducers = (db, id) => {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM Tracks, Producers WHERE albumId = '${id}'`,
      (db, err) => {
        if (err) {
          reject(err);
        }

        resolve(db);
      }
    );
  });
};
