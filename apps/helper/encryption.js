var config = require('config');
var excrypt = require('password-hash');

module.exports.hash_password = function(password) {
    return excrypt.generate(password);
}
module.exports.compare_password = function(password, hash) {
    return excrypt.verify(password, hash);
}