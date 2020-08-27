var mysql = require('mysql');
var config = require('config');

var connection = mysql.createConnection({
    host    : config.get('mysql.host'),
    port    : config.get('mysql.port'),
    database: config.get('mysql.database'),
    user    : config.get('mysql.user'),
    password: config.get('mysql.password')
});

connection.connect();

module.exports.getConnection = function() {
    if(!connection)
        connection.connect();
    return connection;
};
