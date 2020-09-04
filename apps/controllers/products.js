var express = require('express');
var router = express.Router();
var productModel = require('../models/product');

router.get('/', function(req, res) {
    var product = productModel.getAllProduct();
    product.then(function(result) {
        res.render('view', { title: 'Shop | Luc Cui', data: { product: result }});
    }).catch(function(err) {
        res.json({ status_code: 500 });
    });
});
router.get('/:pdId', function(req, res) {
    var product = productModel.getProductById(req.params.pdId);
    product.then(function(data) {
        res.render('admin/dashboard/products/detail', { data: { product: data[0], same_product: data }});
    }).catch(function(err) {
        res.json({message: "Not Found", status_code: 404});
    });
});

module.exports = router;