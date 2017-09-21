var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var csurf = require('csurf');
var CsurfPro = csurf();
var passport = require('passport')
var localStrategy = require('passport-local').Strategy;
var DB = require('../models/model');
var multer = require('multer')

/* config up image */
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + ".jpg")
    }
});
function fileFilter(req, file, cb) {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/gif') {
        return cb(null, false);
    }
    cb(null, true);
}
router.use(multer({
    storage: storage,
    fileFilter: fileFilter
}).single('image'));

/* use csurf */
router.use(CsurfPro);

/* Router for user page */
router.get('/', isLoggedIn, function(req, res, next) {
    res.render('user/index', {
        csurfToken: req.csrfToken(),
        FlashErr: req.flash('error'),
        FlashSuccess : req.flash('success')
    });
})

/* router for /user/login */
router.get('/login', notLoggedIn, function(req, res, next) {
    DB.Image.list(function (data) {
        res.render('user/login', {
            Image : data,
            csurfToken: req.csrfToken(),
            FlashErr: req.flash('error'),
            FlashSuccess : req.flash('success'),
        })
    })
    
})

router.post('/login', passport.authenticate('local.login', {
    successRedirect: '/user',
    failureRedirect: '/user/login',
    failureFlash: true
}))

/* Router for user/logout */
router.get('/logout', isLoggedIn, function(req, res, next) {
    req.logout();
    res.redirect('/');
})

/* router for register user /user/regsiter */
router.get('/register', notLoggedIn, function(req, res, next) {
    DB.Image.list(function (data) {
        res.render('user/register', {
            csurfToken: req.csrfToken(),
            FlashErr: req.flash('error'),
            FlashSuccess : req.flash('success'),
            Image : data,
        });
    })
   
})

router.post('/register', function(req, res) {
    req.flash('error', "Tạm thời chưa hoàn thiện, chỉ Admin mới có thể quản trị. Vui lòng quay lại sau.");
    res.redirect('/user/login');
    /* validate param */
    // req.checkBody('user_name', 'Username là chữ hoặc số từ 4-30 kí tự.').isAlphanumeric().isLength({
    //     min: 4,
    //     max: 30
    // });
    // req.checkBody('real_name', 'Tên thật quá ngắn.').isLength({
    //     min: 4,
    //     max: 40
    // });
    // req.checkBody('mail', 'Vui lòng nhập đúng email.').isEmail();
    // req.checkBody('password', 'Password quá ngắn từ 4-30 kí tự.').isLength({
    //     min: 4,
    //     max: 30
    // });
    // req.checkBody('password', 'Password không khớp nhau.').equals(req.body.repassword);
    // /* get errors */
    // var errors = req.validationErrors();
    // if (errors) {
    //     var messages = [];
    //     errors.forEach(function(err) {
    //         messages.push(err.msg);
    //     });
    //     req.flash('error', messages);
    //     res.redirect('/user/register');
    // } else {
    //     /* check on databse */
    //     bcrypt.hash(req.body.password,null,null,function(err,pass) {
    //         DB.User.create(req.body.user_name, req.body.real_name, pass, req.body.mail, function(result) {
    //             /* if error */
    //             if (result.status == "error") {
    //                 messages = result.messages;
    //                 req.flash('error', messages);
    //                 res.redirect('/user/register');
    //             } else {
    //                 req.flash('success', "Bạn vừa đăng kí thành công. Vui lòng đằng nhập lại. ");
    //                 res.redirect('/user/login');
    //             }
    //         });
    //     });
    // }
});

/* Router for admin - category */
router.get('/category',  isLoggedIn,  function(req, res, next) {
    DB.Category.list(function(data) {
        res.render('user/category/list', {
            list_category: data,
            csurfToken: req.csrfToken(),
            FlashErr: req.flash('error'),
            FlashSuccess : req.flash('success'),
        });
    })

});

router.get('/category/add',  isLoggedIn,function(req, res, next) {
    res.render('user/category/add', {
        FlashErr: req.flash('error'),
        FlashSuccess : req.flash('success'),
        csurfToken: req.csrfToken()
    });
})
router.post('/category',  isLoggedIn,function(req, res, next) {
    req.checkBody('title', "Nhập sai tiêu đề.").isLength({
        min: 4,
        max: 20
    });
    req.checkBody('slug', "Sai slug.").isLength({
        min: 4,
        max: 30
    });
    req.checkBody('des', "Chú thích phải là các chữ từ 5-40 kí tự.").isLength({
        min: 4,
        max: 60
    });
    err = req.validationErrors();
    if (err) {
        var messages = [];
        err.forEach(function(err) {
            messages.push(err.msg);
        });
        req.flash('error', messages);
        res.redirect('/user/category/add');
    } else if (typeof req.file === "undefined") {
        req.flash('error', "Hãy chọn 1 ảnh làm avatar cho category.");
        res.redirect('/user/category/add');
    } else {
        DB.Image.create(req.file.path, req.file.size, req.file.mimetype, function(data) {
            DB.Category.create( req.body.slug , req.body.title, req.body.des, data._id, function(data) {
                if (typeof data === "string") {
                    data = JSON.parse(data);
                    req.flash('error', data);
                    res.redirect('/user/category/add');
                } else {
                    req.flash('success', "Thêm thành công.");
                    res.redirect('/user/category');
                }
            })
        });
    }
})

//update

router.put('/category',  isLoggedIn,function(req, res, next) {
    req.checkBody('title', "Nhập sai tiêu đề.").isLength({
        min: 4,
        max: 20
    }).isAlphanumeric();
    req.checkBody('slug', "Sai slug.").isLength({
        min: 4,
        max: 30
    }).isAlphanumeric();
    req.checkBody('des', "Chú thích phải là các chữ từ 5-40 kí tự.").isLength({
        min: 5,
        max: 40
    }).isAlphanumeric();
    err = req.validationErrors();
    if (err) {
        var messages = [];
        err.forEach(function(err) {
            messages.push(err.msg);
        });
        var result = {
            status: 'error',
            messages: messages
        }
        res.json(result);
    } else {
        DB.Category.update(req.body._id, req.body.slug, req.body.title, req.body.des, function(data) {
            if (typeof data._id === "object") {
                var result = {
                    status: 'ok',
                    messages: 'Cập nhật thành công',
                }
                res.json(result)
            } else {
                var result = {
                    status: 'error',
                    messages: 'Có lỗi sảy ra, có thể đã bị trùng slug...',
                }
                res.json(result)
            }

        })
    }
});

router.delete('/category',  isLoggedIn,function(req, res, next) {})

/* Article */
router.get('/article',  isLoggedIn,function(req, res, next) {
    DB.Article.list(function(data) {

        res.render('user/post/list', {
            article: data,
            FlashErr: req.flash('error'),
            FlashSuccess : req.flash('success'),
            csurfToken: req.csrfToken()
        });
    })
})

//add article
router.get('/article/add',  isLoggedIn,function(req, res, next) {
    DB.Category.list(function(category) {
        res.render('user/post/add', {
           FlashErr: req.flash('error'),
            FlashSuccess : req.flash('success'),
            csurfToken: req.csrfToken(),
            category: category,
        })
    })

})

router.post('/article', isLoggedIn, function(req, res, next) {
    var iduser = req.session.passport.user._id;
    if (typeof req.file === "undefined") {
        req.flash('error', "Hãy chọn 1 ảnh làm avatar cho Article.");
        res.redirect('/user/article/add');
    } else {
        DB.Image.create(req.file.path, req.file.size, req.file.mimetype, function(data) {
            
            DB.Article.create(req.body.title, req.body.slug,req.body.des, req.body.tags,iduser, req.body.category, req.body.content, data._id, function(data) {
                if (data.status == 'error') {
                    req.flash('error', data.messages);
                     res.redirect('/user/article/add');
                } else {
                    req.flash('success', "Thêm thành công.");
                    res.redirect('/user/article');
                }
            })
        });
   }
})

/* Tags */
router.get('/tag', isLoggedIn,function(req, res, next) {
    DB.Tag.list(data,function (data) {
        
    })
})

/* Check login authentication */
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/user/login');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/user');
}

module.exports = router;