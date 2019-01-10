const sqlite3 = require('sqlite3').verbose();

module.exports.connect = () => {
  const db = new sqlite3.Database(process.env.DB_NAME);

  db.serialize(() => {
    db.run(
      'CREATE TABLE IF NOT EXISTS Albums (label CHAR, device CHAR, genre CHAR, albumTitle TEXT, band CHAR, year INT(4), albumId CHAR PRIMARY KEY)',
      (db, err) => {
        if (err) {
          console.log(err);
        }
      }
    );

    db.run(
      'CREATE TABLE IF NOT EXISTS Tracks (trackName TEXT, trackLength INT, trackId CHAR PRIMARY KEY)',
      (db, err) => {
        if (err) {
          console.log(err);
        }
      }
    );

    db.run(
      'CREATE TABLE IF NOT EXISTS Producers (producerName CHAR, producerId CHAR PRIMARY KEY)',
      (db, err) => {
        if (err) {
          console.log(err);
        }
      }
    );

    db.run(
      'CREATE TABLE IF NOT EXISTS ProducedBy (albumId CHAR, producerId CHAR PRIMARY KEY)',
      (db, err) => {
        if (err) {
          console.log(err);
        }
      }
    );

    db.run(
      'CREATE TABLE IF NOT EXISTS MadeOf (albumId CHAR, trackId CHAR PRIMARY KEY)',
      (db, err) => {
        if (err) {
          console.log(err);
        }
      }
    );
  });

  console.log(`Connected to database: ${process.env.DB_NAME}...`);

  return db;
};
