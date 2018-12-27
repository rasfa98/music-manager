const router = require('express').Router();

router.route('/:id').post((req, res) => {
  const db = req.app.get('db');

  db.serialize(() => {
    db.run(`DELETE FROM Albums WHERE id = '${req.params.id}'`);
    db.run(`DELETE FROM Tracks WHERE albumId = '${req.params.id}'`);
    db.run(`DELETE FROM Producers WHERE albumId = '${req.params.id}'`, () => {
      req.session.flash = {
        type: 'success',
        message: 'Album was successfully deleted.'
      };

      res.redirect('/manage');
    });
  });
});

module.exports = router;
