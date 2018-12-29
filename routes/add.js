const router = require('express').Router();
const uniqid = require('uniqid');
const databaseQueries = require('../lib/databaseQueries');

router
  .route('/')
  .get((req, res) => {
    res.render('add');
  })
  .post(async (req, res) => {
    const db = req.app.get('db');
    const id = uniqid();

    const newAlbum = [
      req.body.label,
      req.body.device,
      req.body.genre,
      req.body.title,
      req.body.band,
      req.body.year,
      id
    ];

    await databaseQueries.addAlbum(db, newAlbum);

    if (Array.isArray(req.body.track)) {
      for (let i = 0; i < req.body.track.length; i++) {
        const newTrack = [req.body.track[i], req.body.length[i], i + 1, id];
        await databaseQueries.addTrack(db, newTrack);
      }
    } else {
      const newTrack = [req.body.track, req.body.length, 1, id];
      await databaseQueries.addTrack(db, newTrack);
    }

    const producers = req.body.producer.split(',');

    for (let i = 0; i < producers.length; i++) {
      const newProducer = [producers[i], id];
      await databaseQueries.addProducer(db, newProducer);
    }

    req.session.flash = {
      type: 'success',
      message: 'Album was successfully added!'
    };

    res.redirect('/');
  });

module.exports = router;
