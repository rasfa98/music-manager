const router = require('express').Router();
const databaseQueries = require('../lib/databaseQueries');

router.route('/:id').post(async (req, res) => {
  const db = req.app.get('db');

  await databaseQueries.deleteAlbum(db, req.params.id);

  req.session.flash = {
    type: 'success',
    message: 'Album was successfully deleted.'
  };

  res.redirect('/manage');
});

module.exports = router;
