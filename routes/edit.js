const router = require('express').Router();
const databaseQueries = require('../lib/databaseQueries');

router
  .route('/:id')
  .get(async (req, res) => {
    const db = req.app.get('db');

    const context = await databaseQueries.getAllAlbumDetails(db, req.params.id);

    res.render('edit', context);
  })
  .post(async (req, res) => {
    const db = req.app.get('db');

    const newAlbum = [
      req.body.label,
      req.body.device,
      req.body.genre,
      req.body.title,
      req.body.band,
      req.body.year
    ];

    await databaseQueries.deleteTracksAndProducers(db, req.params.id);
    await databaseQueries.updateAlbum(db, req.params.id, newAlbum);

    if (Array.isArray(req.body.track)) {
      for (let i = 0; i < req.body.track.length; i++) {
        const newTrack = [
          req.body.track[i],
          req.body.length[i],
          i + 1,
          req.params.id
        ];
        await databaseQueries.addTrack(db, newTrack);
      }
    } else {
      const newTrack = [req.body.track, req.body.length, 1, req.params.id];
      await databaseQueries.addTrack(db, newTrack);
    }

    const producers = req.body.producer.split(', ');

    for (let i = 0; i < producers.length; i++) {
      const newProducer = [producers[i], req.params.id];
      await databaseQueries.addProducer(db, newProducer);
    }

    req.session.flash = {
      type: 'success',
      message: 'Album has been updated.'
    };

    res.redirect('back');
  });

module.exports = router;
