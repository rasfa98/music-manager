const router = require('express').Router();
const databaseQueries = require('../lib/databaseQueries');
const handleData = require('../lib/handleData');

router
  .route('/')
  .get((req, res) => {
    res.render('add');
  })
  .post(async (req, res) => {
    const db = req.app.get('db');

    const album = handleData.mapAlbumData(req.body);
    const tracks = handleData.mapTrackData(req.body);
    const producers = handleData.mapProducerData(req.body);

    await databaseQueries.addAlbum(db, album, tracks, producers);

    req.session.flash = {
      type: 'success',
      message: 'Album was successfully added!'
    };

    res.redirect('/');
  });

module.exports = router;
