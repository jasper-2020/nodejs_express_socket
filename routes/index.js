var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index_socket', { title: 'Express Socket' });
});

router.get('/test',  function(req, res) {
  req.app.io.emit('tx', {key:"value22"});
  res.render('index', { title: 'Express' });
});

module.exports = router;
