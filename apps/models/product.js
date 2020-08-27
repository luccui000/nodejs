var dbConfig = require('../common/database');
var conn = dbConfig.getConnection();
var q  = require('q');


module.exports.getAllProduct = function() {
    var defer = q.defer();
    conn.query("SELECT * FROM products", function(err, data) {
        if(err)
            defer.reject(err);
        else 
            defer.resolve(data);
    });
    return defer.promise;
};
module.exports.addProduct = function(params) {
    if(params) {
        var defer = q.defer();
        conn.query("INSERT INTO products SET ?", { id: params.id, name: params.name, prices: params.prices, description: params.description, category: params.category, author: params.author, created_at: params.created_at}, function(err, status) {
            if(err) 
                defer.reject(err);
            else 
                defer.resolve(status);
        });
        return defer.promise;
    } 
    return false;
};
module.exports.getProductById = function(pdId) {
    if(pdId) {
        var defer = q.defer();
        conn.query("SELECT * FROM products WHERE ?", { id: pdId }, function(err, status) {
            if(err) 
                defer.reject(err);
            else 
                defer.resolve(status);
        });
        return defer.promise;
    } 
    return false;
};
// UPDATE `myWeb`.`products` SET `author` = 'admin' WHERE (`id` = 'id');
module.exports.updateProduct = function(params) {
    if(params) {
        var defer = q.defer();
        conn.query("UPDATE products SET name = ?, prices = ?, description = ?, category = ?, author = ?, updated_at = ? WHERE id = ?", [ params.name, params.prices, params.description, params.category, params.author, new Date(), params.id ], function(err, result) {
            if(err)
                defer.reject(err);
            else
                defer.resolve(result);
        });
        return defer.promise;
    }
    return false;
};

module.exports.deleteProductById = function(pdId) {
    if(pdId) {
        var defer = q.defer();
        conn.query("DELETE FROM products WHERE ?", { id: pdId }, function(err, result) {
            if(err)
                defer.reject(err);
            else
                defer.resolve(result);
        });
        return defer.promise;
    }
    return false;
};
