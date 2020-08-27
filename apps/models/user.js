var dbConfig = require('../common/database');
var q = require('q');

var conn = dbConfig.getConnection();

module.exports.addUser = function(params) {
    if(params) {
        var defer = q.defer();
        conn.query("INSERT INTO users SET ?", { username: params.username, email: params.email, password: params.password, created_at: params.created_at }, function(err, result) {
            if(err)
                defer.reject(err);
            else 
                defer.resolve(result);
        });
        return defer.promise;
    }
    return false;
}
module.exports.getAllUser = function() {
    var defer = q.defer();
    conn.query("SELECT * FROM users", function(err, result) {
        if(err)
            defer.reject(err);
        else 
            defer.resolve(result);
    });
    return defer.promise;
};
module.exports.getUserById = function(userId) {
    if(userId) {
        var defer = q.defer();
        conn.query("SELECT * FROM users WHERE ?", { id: userId }, function(err, result) {
            if(err)
                defer.reject(err);
            else 
                defer.resolve(result);
        });
        return defer.promise;
    }
    return false;
};
module.exports.getUserByUsername = function(username) {
    if(username) {
        var defer = q.defer();
        conn.query("SELECT * FROM users WHERE ?", { username: username }, function(err, result) {
            if(err)
                defer.reject(err);
            else 
                defer.resolve(result);
        });
        return defer.promise;
    }
    return false;
};
// UPDATE `myWeb`.`posts` SET `author` = 'admin' WHERE (`id` = 'id');
module.exports.updateUser = function(params) {
    if(params) {
        var defer = q.defer();
        conn.query("UPDATE users SET email = ?, roles = ?, updated_at = ? WHERE id = ?", [ params.email, params.roles, params.updated_at, params.id ], function(err, result) {
            if(err)
                defer.reject(err);
            else
                defer.resolve(result);
        });
        return defer.promise;
    }
    return false;
};

// DELETE FROM `myWeb`.`users` WHERE (`id` = 'userId');
module.exports.deleteUserById = function(userId) {
    if(userId) {
        var defer = q.defer();
        conn.query("DELETE FROM users WHERE ?", { id: userId }, function(err, result) {
            if(err)
                defer.reject(err);
            else
                defer.resolve(result);
        });
        return defer.promise;
    }
    return false;
};
