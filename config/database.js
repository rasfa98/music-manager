const sqlite3 = require('sqlite3').verbose();

module.exports.connect = () => {
  const db = new sqlite3.Database(process.env.DB_NAME);

  db.serialize(() => {
    db.run(
      'CREATE TABLE IF NOT EXISTS Albums (label CHAR, device CHAR, genre CHAR, albumTitle TEXT, band CHAR, year INT(4))'
    );
    db.run(
      'CREATE TABLE IF NOT EXISTS Tracks (name CHAR, length INT, albumTitle TEXT, band CHAR, trackNr INT)'
    );
    db.run(
      'CREATE TABLE IF NOT EXISTS Producers (name CHAR, albumTitle TEXT, band CHAR)'
    );
  });

  console.log(`Connected to database: ${process.env.DB_NAME}...`);

  return db;
};
