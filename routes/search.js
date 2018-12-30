const router = require('express').Router();
const databaseQueries = require('../lib/databaseQueries');

router.route('/').get(async (req, res) => {
  const db = req.app.get('db');

  const albums = await databaseQueries.searchAlbum(db, req.query.query);

  res.render('results', { albums: albums });
});

module.exports = router;
