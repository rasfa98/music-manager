const router = require('express').Router();

router.route('/').get((req, res) => {
  res.render('add');
});

module.exports = router;
