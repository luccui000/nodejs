var app = require('express');
var config = require('config');
var userModel = require('../models/user');
var postModel = require('../models/post');
var pdModel   = require('../models/product');
var encrypt = require('../helper/encryption');
var set_role = require('../helper/setRole');
var normalizeText = require('../helper/normolizeText');
var makePdId = require('../helper/makePdId');

var router = app.Router();
var counter = 0;

router.get('/', function(req, res) {
    if(req.session.user) {
        res.redirect('/admin/posts');
    } else {
        res.render('admin/form-sign/signin', { title: 'Sign Up | Luc Cui', data: {}});
    }  
});
// ------------------------------ SIGN UP ------------------------------ // 
router.get('/signup', function(req, res) {
    res.render('admin/form-sign/signup', { title: 'Sign Up | Luc Cui', data: {}});
});
router.post('/signup', function(req, res) {
    var newUser = req.body;
    if(newUser.username.trim().length == 0 || newUser.email.trim().length == 0 ) {
        res.render('admin/form-sign/signup', { title: 'Sign Up | Luc Cui', data: { error: "Vui lòng không để trống !"}});
    } else {
        if(newUser.password != newUser.repeat_password)
            res.render('admin/signup', { title: 'Sign Up | Luc Cui', data: { error: "Mật khẩu không trùng nhau !"}});
        else {
            var hash = encrypt.hash_password(newUser.password);
            counter++;
            var params = {
                username: newUser.username,
                email   : newUser.email,
                password: hash,
                created_at: new Date()
            };
            var result = userModel.addUser(params);
            console.log(result);
            result.then(function(data){
                res.json({ params });
            }).catch(function(err) {
                res.render('admin/signup', { title: 'Sign Up | Luc Cui', data: { error: err}});
            });
        }       
    }
});
// ------------------------------ SIGN IN ------------------------------ // 
router.get('/signin', function(req, res) {
    res.render('admin/form-sign/signin', { title: 'Sign In | Luc Cui', data: {}});
});
router.post('/signin', function(req, res) {
    var loginUser = req.body;
    if(loginUser.username.trim().length == 0 || loginUser.password.trim().length == 0 ) {
        res.render('admin/form-sign/signin', { title: 'Sign In | Luc Cui', data: { error: "Vui lòng không để trống !"}});
    } else {
        var result = userModel.getUserByUsername(loginUser.username);
        result.then(function(data) {
            if(encrypt.compare_password(loginUser.password, data[0].password)) {
                req.session.user = data[0];
                res.redirect('/admin/posts');
            } else {
                res.render('admin/form-sign/signin', { title: 'Sign In | Luc Cui', data: { status_code: 404, error: "Sai username hoặc mật khẩu !"}});
            }
        }).then(function(err) {
            res.render('admin/form-sign/signin', { title: 'Sign In | Luc Cui', data: { error: "Sai username hoặc mật khẩu !"}});
        });
        
    }
});
router.get('/posts', function(req, res) {
    if(req.session.user || req.cookies) {
        var result = postModel.getAllPost();
        result.then(function(post) {
            res.render('admin/dashboard/posts', { title: 'Dashboard | Luc Cui', data: { error: false, post: post}});
        }).catch(function(err) {
            res.json({ err: err});
        });
    } else {
        res.render('admin/form-sign/signin', { title: 'Sign In | Luc Cui', data: {}});
    }
});
// ------------------------------ POSTS ------------------------------ // 
router.get('/posts/new', function(req, res) {
    if(req.session.user) {
        res.render('admin/dashboard/posts/new', { title: 'Add New Post | Luc Cui', data: {}});
    } else {
        res.render('admin/form-sign/signin', { title: 'Sign In | Luc Cui', data: {}});
    }
});
router.post('/posts/new' , function(req, res) {
    var newPost = req.body;
    if(newPost.title.trim().length == 0 || newPost.content.trim().length == 0) {
        res.render('admin/dashboard/posts/new', { title: 'Add New Post | Luc Cui', data: { error: 'Vui lòng điền đầy đủ !!!'}});
    } else {
        var date = new Date();
        var postObj = {
            title: newPost.title,
            author: newPost.author,
            content: newPost.content,
            created_at: date
        };
        var status = postModel.addNewPost(postObj);
        status.then(function(result) {
            res.redirect('/admin/posts');
        }).catch(function(err) {
            res.render('admin/dashboard/posts/new', { title: 'Add New Post | Luc Cui',data: { error: err}});
        });
    }
});
router.get('/posts/edit/:postId', function(req, res) {
    if(req.session.user) {
        var status = postModel.getPostById(req.params.postId);
        status.then(function(data) {
            var postEdit = {
                id: data[0].id,
                title: data[0].title,
                author: data[0].author,
                content: data[0].content
            };
            res.render('admin/dashboard/posts/edit', { title: 'Edit Post | Luc Cui', data: { post: postEdit, error: false}});
        }).catch(function(err) {
            res.render('admin/dashboard/posts/', { title: 'Dashboard | Luc Cui', data: {}});
        });
    } else {
        res.render('admin/form-sign/signin', { title: 'Sign In | Luc Cui', data: {}});
    }
});
router.put('/posts/edit', function(req, res) {
    if(req.session.user) {
        var reqPost = req.body;
        var date = new Date();
        var params = {
            id: reqPost.id,
            title: reqPost.title,
            author: reqPost.author,
            content: reqPost.content,
            updated_at: date
        };
        var status = postModel.editPost(params);
        status.then(function(data) {
            res.render('admin/dashboard/posts/', { title: 'Dashboard | Luc Cui', data: {status: 'Đã lưu vào cơ sở dữ liệu'}});
        }).catch(function(err) {
            res.render('admin/dashboard/posts/edit', { title: 'Dashboard | Luc Cui', data: {error: err}});
        });
    } else {
        res.render('admin/form-sign/signin', { title: 'Sign In | Luc Cui', data: {}});
    }
});
router.get('/posts/delete/:postId', function(req, res) {
    if(req.session.user) {
        var del_post = postModel.deletePost(req.params.postId);
        del_post.then(function(data){
            var result = postModel.getAllPost();
            result.then(function(post) {    
                res.render('admin/dashboard/posts', { title: 'Dashboard | Luc Cui', data: { error: false, post: post}});
            }).catch(function(err) {
                res.json({ err: err});
            });
        }).catch(function(err) {
            res.render('admin/dashboard/posts', { title: 'Dashboard | Luc Cui', data: {error: err}});
        });
    } else {
        res.render('admin/form-sign/signin', { title: 'Sign In | Luc Cui', data: {}});
    }
});
// ------------------------------ USERS ------------------------------ // 
router.get('/users', function(req, res) {
    if(req.session.user) {
        var userMd = userModel.getAllUser();
        userMd.then(function(userArr) {
            res.render('admin/dashboard/users', { title: 'Dashboard | Luc Cui', data: { error: false, user: userArr}});
        }).catch(function(err) {
            res.json({ err: err});
        });
    } else {
        res.render('admin/form-sign/signin', { title: 'Sign In | Luc Cui', data: {}});
    }
});
router.get('/users/edit/:userId', function(req, res) {
    if(req.session.user) {  
        var user_id = userModel.getUserById(req.params.userId);
        user_id.then(function(data) {
            res.render('admin/dashboard/users/edit', { title: 'Edit | Luc Cui', data: { user: data[0] }});
        }).catch(function(err) {
            res.status(404).json({ status_code: 404 });
        });
    } else {
        res.render('admin/form-sign/signin', { title: 'Sign In | Luc Cui', data: {}});
    }
});
router.delete('/users/delete', function(req, res) {
    if(req.session.user) {
        var userId = req.body.id;
        var result = userModel.deleteUserById(userId);
        result.then(function(data) {
            res.redirect('/admin/users/');
        }).catch(function(err) {
            res.status(500).json({ status_code: 500, message: err });
        });
    } else {
        res.render('admin/form-sign/signin', { title: 'Sign In | Luc Cui', data: {}});
    }
});
router.put('/users/edit/', function(req, res) {
    if(req.session.user) {
        var reqUser = req.body;
        var role;
        switch(reqUser.role) {
            case 'Admin':
                role = 2;
                break;
            case 'QTV':
                role = 1;
                break;
            case 'User':
                role = 0;
                break;
        };
        var date = new Date();
        var params = {
            id: reqUser.id,
            email: reqUser.email,
            roles: role,
            updated_at: date
        };
        var status = userModel.updateUser(params);
        alert(status);
        status.then(function(data) {
            res.render('admin/dashboard/users/', { title: 'Dashboard - User Manager| Luc Cui', data: {status: 'Đã lưu vào cơ sở dữ liệu'}});
        }).catch(function(err) {
            res.render('admin/dashboard/posts/edit', { title: 'Dashboard | Luc Cui', data: {error: err}});
        });
    } else {
        res.render('admin/form-sign/signin', { title: 'Sign In | Luc Cui', data: {}});
    }
});
// ------------------------------ PRODUCTS ------------------------------ //
router.get('/products', function(req, res) {
    if(req.session.user) {
        var result = pdModel.getAllProduct();
        result.then(function(data) {
            res.render('admin/dashboard/products', { title: 'Products | Luc Cui', data: { product: data }});
        }).catch(function(err) {
            res.json({ error: err });
        })
    } else {
        res.render('admin/form-sign/signin', { title: 'Sign In | Luc Cui', data: {}});
    }
});
router.get('/products/new', function(req, res) {
    if(req.session.user) {
        var product = {
            id: makePdId.makeId(config.get('IDProduct')),
            category: ['Rau', 'Thực phẩm tươi sống ', 'Thực phẩm đông lạnh', 'Đồ điện tử']
        };
        res.render('admin/dashboard/products/new', { title: 'Add Product | Luc Cui', data: { product: product }});
    } else {
        res.render('admin/form-sign/signin', { title: 'Sign In | Luc Cui', data: {}});
    }
});
router.post('/products/new', function(req, res) {
    if(req.session.user) {
        var newPro = req.body;
        var pdObj = {
            id: newPro.product_id,
            name: newPro.product_name, 
            prices: newPro.product_prices,
            description: newPro.product_description,
            category: newPro.product_categorie,
            author: newPro.author,
            created_at: new Date()
        };
        var result = pdModel.addProduct(pdObj);
        result.then(function(data) {
            res.redirect('/admin/products/new');
        }).catch(function(err) {
            res.status(500).json({ status_code: 500, data: { error: err }});
        });
    } else {
        res.render('admin/form-sign/signin', { title: 'Sign In | Luc Cui', data: {}});
    }
});
router.get('/products/edit/:pdId', function(req, res) {
    if(req.session.user) {
        var result = pdModel.getProductById(req.params.pdId);
        result.then(function(product) {
            var category = ['Rau', 'Thực phẩm tươi sống ', 'Thực phẩm đông lạnh'];
            res.render('admin/dashboard/products/edit', { title: 'Edit Product | Luc Cui', data: { product: product[0], category: category }});
        }).catch(function(err) {
            res.status(500).json({ status_code: 500, data: { error: err }});
        });
    } else {
        res.render('admin/form-sign/signin', { title: 'Sign In | Luc Cui', data: {}});
    }
});
router.put('/products/edit', function(req, res) {
    if(req.session.user) {
        var pdEdit = req.body;
        var result = pdModel.updateProduct(pdEdit);
        result.then(function(data) {
            res.redirect('/admin/products');
        }).catch(function(err) {
            res.status(500).json({ status_code: 500, data: { error: err }});
        })
    } else {
        res.render('admin/form-sign/signin', { title: 'Sign In | Luc Cui', data: {}});
    }
});
router.delete('/products/delete', function(req, res) {
    if(req.session.user) {
        var reqDelId = req.body.id;
        var result = pdModel.deleteProductById(reqDelId);
        result.then(function(status) {
            res.status(200).json({message: 'Delete Successfully', status_code: 200 });
        }).catch(function(err) {
            res.status(500).json({ status_code: 500, data: { error: err }});
        });
    } else {
        res.render('admin/form-sign/signin', { title: 'Sign In | Luc Cui', data: {}});
    }
});

module.exports = router;