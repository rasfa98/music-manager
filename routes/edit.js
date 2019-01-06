const router = require('express').Router();
const databaseQueries = require('../lib/databaseQueries');
const handleData = require('../lib/handleData');

router
  .route('/:id')
  .get(async (req, res) => {
    const db = req.app.get('db');

    const data = await databaseQueries.getAlbum(db, req.params.id);
    const album = handleData.mapAllAlbumDetails(data);

    res.render('edit', album);
  })
  .post(async (req, res) => {
    const db = req.app.get('db');

    const album = handleData.mapAlbumData(req.body);
    const tracks = handleData.mapTrackData(req.body);
    const producers = handleData.mapProducerData(req.body);

    await databaseQueries.editAlbum(
      db,
      req.params.id,
      album,
      tracks,
      producers
    );

    req.session.flash = {
      type: 'success',
      message: 'Album has been updated.'
    };

    res.redirect('back');
  });

module.exports = router;
