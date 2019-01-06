const sqlite3 = require('sqlite3').verbose();
const databaseQueries = require('../lib/databaseQueries');

module.exports.connect = async () => {
  const db = new sqlite3.Database(process.env.DB_NAME);

  await databaseQueries.createTables(db);

  console.log(`Connected to database: ${process.env.DB_NAME}...`);

  return db;
};
