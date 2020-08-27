var app = require('express');
var router = app.Router();

router.get('/', function(req, res) {
    res.render('blog/index');
});


module.exports = router;