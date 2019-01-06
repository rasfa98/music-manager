const router = require('express').Router();
const databaseQueries = require('../lib/databaseQueries');
const handleData = require('../lib/handleData');

router.route('/:id').get(async (req, res) => {
  const db = req.app.get('db');

  const data = await databaseQueries.getAlbum(db, req.params.id);
  const album = handleData.mapAllAlbumDetails(data);

  res.render('view', album);
});

module.exports = router;
