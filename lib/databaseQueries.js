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

module.exports.getAlbums = db => {
  return new Promise((resolve, reject) => {
    db.all('SELECT title, id, band, device FROM Albums', (err, rows) => {
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
      tracks: null,
      producers: null
    };

    db.serialize(() => {
      db.all(`SELECT * FROM Albums WHERE id = '${id}'`, (err, rows) => {
        if (err) {
          reject(err);
        }

        context.album = rows[0];
      });

      db.all(`SELECT * FROM Tracks WHERE albumId = '${id}'`, (err, rows) => {
        if (err) {
          reject(err);
        }

        context.tracks = rows;
      });

      db.all(`SELECT * FROM Producers WHERE albumId = '${id}'`, (err, rows) => {
        if (err) {
          reject(err);
        }

        const producers = [];

        rows.forEach(row => {
          producers.push(row.name);
        });

        context.producers = producers.join(', ');

        resolve(context);
      });
    });
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
