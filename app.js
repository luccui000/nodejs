var express = require('express');
var config  = require('config');
var app = require('ejs');
var bodyParser = require('body-parser');
var sesssion = require('express-session');
var app = express();


var controller = require(__dirname + '/apps/controllers');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/apps/views');


app.use('/static', express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(sesssion({
    secret: config.get('secret'),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(controller);


const host = config.get('server.host');
const port = config.get('server.port');

app.listen(port, function(data) {
    console.log("Server running on port ", port);
});