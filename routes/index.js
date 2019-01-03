const router = require('express').Router();
const databaseQueries = require('../lib/databaseQueries');

router.route('/').get(async (req, res) => {
  const db = req.app.get('db');

  const albums = await databaseQueries.getAlbums(db, req.query.sort);

  res.render('index', { albums: albums });
});

module.exports = router;
