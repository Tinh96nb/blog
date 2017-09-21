var express = require('express');
var router = express.Router();
var DB = require('../models/model');
var sanitizer = require('sanitizer');


/* GET home page. */
router.get('/', function(req, res, next) {
    DB.Category.list(function(data) {
        var list_category = data;
        DB.Article.listbyview(function(data) {
            var list_article = data;
            DB.Tag.list(function (data) {
                var list_tag = data;
                DB.Image.list(function (data) {
                    list_image = data;

                    /* Get list article */
                    DB.Article.list(function (data) {
                        res.render('blog/index', {
                            Category: list_category,
                            Article: list_article,
                            Image : list_image,
                            Tag : list_tag,
                            listcateindex : data,
                        });
                    })
                    /* Get list article */

                })
            }) 
            
        })
    });
});

/* Get single post */
router.get('/post/:slug', function(req, res, next) {
    DB.Category.list(function(data) {
        var list_category = data;
        DB.Article.listbyview(function(data) {
            var list_article = data;
            DB.Tag.list(function (data) {
                var list_tag = data;
                DB.Image.list(function (data) {
                    list_image = data;

                    /* Get sigle post */
                    DB.Article.getBySlug(req.params.slug,function (data) {
                        if(!data){
                            data = false;
                        }
                        res.render('blog/single-post', {
                        Category: list_category,
                        Article: list_article,
                        Image : list_image,
                        Tag : list_tag,
                        post: data
                        });
                    })
                     /* Get sigle post */
                })
            }) 
        })
    });
})

/* Get post on category */
router.get('/category/:slug', function(req, res, next) {
    req.checkParams('slug', 'hacking').isAlpha();
    /* get errors */
    var errors = req.validationErrors();
    DB.Category.list(function(data) {
        var list_category = data;
        DB.Article.listbyview(function(data) {
            var list_article = data;
            DB.Tag.list(function (data) {
                var list_tag = data;
                DB.Image.list(function (data) {
                    list_image = data;

                    /* Get post by category */
                    DB.Article.getByCategory(req.params.slug,function (data) {
                        data.key = req.params.slug;
                        res.render('blog/post-category', {
                        Category: list_category,
                        Article: list_article,
                        Image : list_image,
                        Tag : list_tag,
                        data: data
                        });
                    })
                     /* Get post by category*/
                })
            }) 
        })
    })
});

/* Get post by user */
router.get('/userpost/:slug', function(req, res, next) {
    req.checkParams('slug', 'hacking').isDataURI();
    /* get errors */
    var errors = req.validationErrors();
    DB.Category.list(function(data) {
        var list_category = data;
        DB.Article.listbyview(function(data) {
            var list_article = data;
            DB.Tag.list(function (data) {
                var list_tag = data;
                DB.Image.list(function (data) {
                    list_image = data;

                    /* Get post by user */
                    DB.Article.getByUser(req.params.slug,function (data) {
                        data.key = req.params.slug;
                        res.render('blog/post-user', {
                        Category: list_category,
                        Article: list_article,
                        Image : list_image,
                        Tag : list_tag,
                        data: data
                        });
                    })
                     /* Get post by user */
                })
            }) 
        })
    })
});

/* Get post on tag */
router.get('/tag/:slug', function(req, res, next) {
    req.checkParams('slug', 'hacking').isAlpha();
    /* get errors */
    var errors = req.validationErrors();
    DB.Category.list(function(data) {
        var list_category = data;
        DB.Article.listbyview(function(data) {
            var list_article = data;
            DB.Tag.list(function (data) {
                var list_tag = data;
                DB.Image.list(function (data) {
                    list_image = data;
                    
                    /* Get post by category */
                    DB.Article.getByTag(req.params.slug,function (data) {
                        data.key = req.params.slug;
                        res.render('blog/post-tag', {
                        Category: list_category,
                        Article: list_article,
                        Image : list_image,
                        Tag : list_tag,
                        data: data
                        });
                    })
                     /* Get post by category*/
                })
            }) 
        })
    })
});

/* Search post */
router.get('/search', function(req, res, next) {
    var key = sanitizer.escape(req.query.key);
    DB.Category.list(function(data) {
        var list_category = data;
        DB.Article.listbyview(function(data) {
            var list_article = data;
            DB.Tag.list(function (data) {
                var list_tag = data;
                DB.Image.list(function (data) {
                    list_image = data;

                    /* Search post */
                    DB.Article.search(req.params.slug,function (data) {
                        data.key = key;
                        res.render('blog/search', {
                        Category: list_category,
                        Article: list_article,
                        Image : list_image,
                        Tag : list_tag,
                        data: data
                        });
                    })
                     /* Search post */
                })
            }) 
        })
    })
});
module.exports = router;