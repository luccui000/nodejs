var dbConfig = require('../common/database');
var q = require('q');
var conn = dbConfig.getConnection();


makeId = function (length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports.getAllPost = function() {
    var defer = q.defer();
    conn.query("SELECT * FROM posts", function(err, data) {
        if(err) 
            defer.reject(err)
        else 
            defer.resolve(data);
    });
    return defer.promise;
};
module.exports.getPostById = function(postId) {
    if(postId) {
        var defer = q.defer();
        conn.query("SELECT * FROM posts WHERE ?", { id: postId}, function(err, data) {
            if(err) 
                defer.reject(err)
            else 
                defer.resolve(data);
        });
        return defer.promise;
    } 
    return false;
};
module.exports.addNewPost = function(params) {
    if(params) {
        var defer = q.defer();
        var id = makeId(5);
        conn.query("INSERT INTO posts SET ?", {id: id, title: params.title, author: params.author, content: params.content, created_at: params.created_at }, function(err, result) {
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
module.exports.editPost = function(params) {
    if(params) {
        var defer = q.defer();
        conn.query("UPDATE posts SET title = ?, author = ?, content = ?, updated_at = ? WHERE id = ?", [ params.title, params.author, params.content, params.updated_at, params.id ], function(err, result) {
            if(err)
                defer.reject(err);
            else
                defer.resolve(result);
        });
        return defer.promise;
    }
    return false;
};
// DELETE FROM `myWeb`.`posts` WHERE (`id` = 'Y3h5T');
module.exports.deletePost = function(postId) {
    if(postId) {
        var defer = q.defer();
        conn.query("DELETE FROM posts WHERE ?", { id: postId }, function(err, result) {
            if(err)
                defer.reject(err);
            else
                defer.resolve(result);
        });
        return defer.promise;
    }
    return false;
};