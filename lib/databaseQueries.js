module.exports.addAlbum = async (db, album) => {
  db.run(
    'INSERT INTO Albums (label, device, genre, title, band, year, id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    album,
    (db, err) => {
      if (err) {
        console.log(err);
      }

      return db;
    }
  );
};

module.exports.addTrack = async (db, track) => {
  db.run(
    'INSERT INTO Tracks (name, length, trackNr, albumId) VALUES (?, ?, ?, ?)',
    track,
    (db, err) => {
      if (err) {
        console.log(err);
      }

      return db;
    }
  );
};

module.exports.addProducer = async (db, producer) => {
  db.run(
    'INSERT INTO Producers (name, albumId) VALUES (?, ?)',
    producer,
    (db, err) => {
      if (err) {
        console.log(err);
      }

      return db;
    }
  );
};

module.exports.deleteAlbum = async (db, id) => {
  db.serialize(() => {
    db.run(`DELETE FROM Albums WHERE id = '${id}'`);
    db.run(`DELETE FROM Tracks WHERE albumId = '${id}'`);
    db.run(`DELETE FROM Producers WHERE albumId = '${id}'`, (db, err) => {
      if (err) {
        console.log(err);
      }

      return db;
    });
  });
};

module.exports.deleteTracksAndProducers = async (db, id) => {
  db.serialize(() => {
    db.run(`DELETE FROM Tracks WHERE albumId = '${id}'`);
    db.run(`DELETE FROM Producers WHERE albumId = '${id}'`, (db, err) => {
      if (err) {
        console.log(err);
      }

      return db;
    });
  });
};
