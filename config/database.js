const sqlite3 = require('sqlite3').verbose();

module.exports.connect = () => {
  const db = new sqlite3.Database(process.env.DB_NAME);

  db.serialize(() => {
    db.run(
      'CREATE TABLE IF NOT EXISTS Albums (label CHAR, device CHAR, genre CHAR, title TEXT, band CHAR, year INT(4), id CHAR)'
    );
    db.run(
      'CREATE TABLE IF NOT EXISTS Tracks (name CHAR, length INT, trackNr INT, albumId INT)'
    );
    db.run('CREATE TABLE IF NOT EXISTS Producers (name CHAR, albumId INT)');
  });

  console.log(`Connected to database: ${process.env.DB_NAME}...`);

  return db;
};
