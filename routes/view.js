const router = require('express').Router();
const databaseQueries = require('../lib/databaseQueries');

router.route('/:id').get(async (req, res) => {
  const db = req.app.get('db');

  const album = await databaseQueries.getAllAlbumDetails(db, req.params.id);

  res.render('view', album);
});

module.exports = router;
