var express = require('express');
var io = require('socket.io').listen(8080);
var counter = 0;
var router = express.Router();

router.use('/admin', require(__dirname + '/admin'));
router.use('/blog', require(__dirname + '/blog'));
router.use('/api', require(__dirname + '/api'));
router.use('/products', require(__dirname + '/products'));

router.use('/set-cookies', function(req, res) {
    // res.cookie(, true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true});
    // res.setHeader('Set-Cookie', 'newUser=true');
    res.send(`New Session Cookies Login`);
});
router.use('/get-cookies', function(req, res) {
    var cookies = req.body;
    res.json({ cookies: cookies });
});

io.sockets.on('connect', function(socket) {
    counter++;
    io.sockets.emit('message', { count : counter });

    socket.disconnect('disconnect', function() {
        counter--;
        io.sockets.emit('message', { count : counter });
    })
});
router.use('/', function(req, res) {
    res.render('blog/index', { title: 'Home Page | Luc Cui'});
})

module.exports = router;