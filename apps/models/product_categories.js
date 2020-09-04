var dbConfig = require('../common/database');
var conn = dbConfig.getConnection();
var q  = require('q');


module.exports.getCounterByPdId = function(product_id) {
    if(product_id) {
        var defer = q.defer();
        conn.query("SELECT * FROM product_categories WHERE ?", { key: product_id }, function(err, data) {
            if(err) 
                defer.reject(err);
            else 
                defer.resolve(data);
        });
        return defer.promise;
    } 
    return false;
};
module.exports.addNewProductCounter = function(product_id) {
    if(product_id) {
        var defer = q.defer();
        conn.query("INSERT INTO product_categories SET ?", { key: product_id }, function(err, data) {
            if(err) 
                defer.reject(err);
            else 
                defer.resolve(data);
        });
        return defer.promise;
    } 
    return false;
};
module.exports.updateProductCategorie = function(params) {
    if(params) {
        var defer = q.defer();
        conn.query("UPDATE product_categories WHERE key = ? SET value = ? ", [ params.key, params.value], function(err, data) {
            if(err) 
                defer.reject(err);
            else 
                defer.resolve(data);
        });
        return defer.promise;
    } 
    return false;
}