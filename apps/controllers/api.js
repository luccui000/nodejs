var express = require('express');
var router = express.Router();
var productModel = require('../models/product');


router.get('/products', function(req, res) {
    // if(req.session.user) {
        var api_product = req.params.pdId;
        var result = productModel.getAllProduct();
        result.then(function(data) {
                res.json({ api_product : data });
        }).catch(function(err) {
            res.status(404).json({ message: 'Not Found', status_code: 404} );
        });
    // } else {
    //     res.render('admin/form-sign/signin', { title: 'Sign In | Luc Cui', data: { error: false }});
    // }
});

module.exports = router;