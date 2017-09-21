var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
require('./connect')
var Article = require('./Article');
var Category = require('./Category');
var User = require('./User');
var Tag = require('./Tag');
var Image = require('./Images');

function DB() {
    var Userdb = {

        /* get list user */
        list: function (callback) {
            User.find(function (error, data) {
                if (error) {
                    result = {
                        status: 'error',
                    }
                    return callback(result);
                } else {
                    result = {
                        status: 'ok',
                        data: data,
                    }
                    return callback(result);
                }
            });
        },

        /* Register */
        create: function (user_name, real_name, password, mail, callback) {
            usernew = new User({
                user_name: user_name,
                real_name: real_name,
                password: password,
                mail: mail
            });
            usernew.save(function (error, data) {
                if (error) {
                    errors = Object.keys(error.errors).map(function (key) {
                        return error.errors[key].message;
                    });
                    result = {
                        status: 'error',
                        messages: errors,
                    }
                    return callback(result);
                } else {
                    result = {
                        status: 'ok',
                        data: data
                    }
                    return callback(result);
                }
            });
        },
        update: function (_id, real_name = null, password = null, callback) {
            if(!mongoose.Types.ObjectId.isValid(_id)){
                result = {
                        status: 'error',
                        messages: "Nghi váº¥n hack",
                }
                return callback(result);
            }
            else {
                User.update({
                _id: new mongoose.mongo.ObjectID(_id)
                }, {
                    $set: {
                        real_name: real_name,
                        password: password
                    }
                }, function (err, doc) {
                    if (err) {
                        result = {
                            status: 'error',
                            messages: err,
                    }
                    return callback(result);
                    }
                        result = {
                                status: 'ok',
                                data: doc,
                        }
                    return callback(result);
                });
            }
        },
        del: function (_id, callback) {
            User.findOneAndRemove({
                _id: new mongoose.mongo.ObjectID(_id)
            }, function (err, doc) {
                if (err) return callback(err);
                return callback(doc);
            });
        }
    };
    var Categorydb = {
        list: function (callback) {
            Category.find().populate('image_id')
            .sort({created_at: -1})
            .exec(function (err, doc) {              
                if (err) return callback(err);
                return callback(doc);
            })
        },
        create: function (slug, title, des, image_id, callback) {
            catenew = new Category({
                title: title,
                slug: slug,
                des: des,
                image_id: new mongoose.mongo.ObjectID(image_id)
            });
            catenew.save(function (error, doc) {
                if (error) {
                    var errors = Object.keys(error.errors).map(function (key) {
                        return error.errors[key].message;
                    });
                    errors = JSON.stringify(errors);
                    return callback(errors);
                } else return callback(doc);
            })
        },

        update: function (_id, slug, title, des, callback) {
            Category.findByIdAndUpdate(new mongoose.mongo.ObjectID(_id), {
                $set: {
                    slug: slug,
                    title: title,
                    des: des
                }
            }, {
                new: true
            }, function (err, data) {
                if (err) return callback(err);
                return callback(data);
            });
        }
    };
    var TagsDB = {
        list: function (callback) {
            Tag.find()
            .sort({created_at: -1})
            .exec(function (err, doc) {
                if (err) return callback(err);
                return callback(doc);
            })
        },
        create: function (tags,callback) {
           
        },
    };
    var Articledb = {
        search : function (article,callback){
            Article.find({title: new RegExp('^'+article+'$', "ig")})
            .sort({created_at: -1})
            .populate('created_by_id','user_name')
            .populate('category_id','title')
            .populate('tags_id')
            .populate('image_id','path')
            .exec(function (err, data) {
                if (err) return callback(err);
                    if(data.length==0){
                        return callback({status: 'error',messages: 'Không có bài viết nào được tìm thấy.'});
                    }
                    return callback({status: 'ok',data: data});
            })
        },
        getBySlug: function (slug, callback) {
            Article.findOne({slug: slug }, function (err,view) { 
                    if(view){
                        view = (view.view+1);
                        Article.findOneAndUpdate({slug: slug}, {$set:{view :view }}, {new: true} )
                        .sort({created_at: -1})
                        .populate('created_by_id','user_name')
                        .populate('category_id','title')
                        .populate('tags_id')
                        .populate('image_id','path')
                        .exec(function (err, data) {
                                if (err) return callback(err);
                                return callback(data);
                        })
                    } else return callback(view);
             })
            
        },
        getByCategory: function (slugcategory, callback) {
            Category.findOne({ slug: slugcategory}, "_id", function (err, data) {
                if (!data) return callback({status: 'error',messages: 'Category khÃ´ng tá»“n táº¡i.'});
                else {
                    data = new mongoose.mongo.ObjectID(data._id);
                    Article.find({category_id: data})
                    .sort({created_at: -1})
                    .populate('created_by_id','user_name')
                    .populate('category_id','title')
                    .populate('tags_id')
                    .populate('image_id','path')
                    .exec(function (err, data) {
                        if (err) return callback(err);
                        if(data.length==0){
                            return callback({status: 'error',messages: 'Ch?a c� b�i vi?t n�o trong Category n�y.'});
                        }
                        return callback({status: 'ok',data: data});
                    })
                }
            });
        },
        getByUser: function (user_name, callback) {
            User.findOne({ user_name: user_name}, "_id", function (err, data) {
                if (!data) return callback({status: 'error',messages: 'NgÆ°á»�i dÃ¹ng khÃ´ng tá»“n táº¡i hoáº·c Ä‘Ã£ bá»‹ band.'});
                else {
                    data = new mongoose.mongo.ObjectID(data._id);
                    Article.find({created_by_id: data})
                    .sort({created_at: -1})
                    .populate('created_by_id','user_name')
                    .populate('category_id','title')
                    .populate('tags_id')
                    .populate('image_id','path')
                    .exec(function (err, data) {
                        if (err) return callback(err);
                        if(data.length==0){
                            return callback({status: 'error',messages: 'ChÆ°a cÃ³ bÃ i viáº¿t nÃ o cá»§a ngÆ°á»�i nÃ y.'});
                        }
                        return callback({status: 'ok',data: data});
                    })
                }
            });
        },
        getByTag: function (tag, callback) {
            Tag.findOne({ tag_name: tag}, "_id", function (err, data) {
                if (!data) return callback({status: 'error',messages: 'Tag khÃ´ng tá»“n táº¡i.'});
                else {
                    data = new mongoose.mongo.ObjectID(data._id);
                    Article.find({tags_id: data})
                    .sort({created_at: -1})
                    .populate('created_by_id','user_name')
                    .populate('category_id','title')
                    .populate('tags_id')
                    .populate('image_id','path')
                    .exec(function (err, data) {
                        if (err) return callback(err);
                        if(data.length==0){
                            return callback({status: 'error',messages: 'ChÆ°a cÃ³ bÃ i viáº¿t nÃ o trong tag nÃ y.'});
                        }
                        return callback({status: 'ok',data: data});
                    })
                }
            });
        },
        listbyview: function (callback) {
            Article.find()
                .sort({view: -1})
                .limit(5)
                .populate('image_id','path')
                .exec(function (err, data) {
                    return callback(data);
                })
        },
        list: function (callback) {
            Article.find()
                .sort({created_at: -1})
                .populate('created_by_id','user_name')
                .populate('category_id','title')
                .populate('tags_id')
                .populate('image_id','path')
                .exec(function (err, data) {
                    return callback(data);
                })
        },
        create: function (title, slug ,des, tags ,created_by_id, category_id, body, image_id, callback) {
            if (category_id.constructor === Array) {
                category_id = category_id.map(mongoose.Types.ObjectId);
            } else category_id = new mongoose.mongo.ObjectID(category_id);
            tags = tags.split(" ");
            /* tag id trung */
            var tagidtrung = function (callback) {
                tags_id = [];
                 for(i=0; i<tags.length; i++){
                    var tag = new Tag({tag_name:tags[i]})
                    tag.save(function (err,doc) {  
                        if(err){
                        } else {
                        }
                    })
                }
                Tag.find({tag_name:  { $in: tags } },function (err,doc) {
                    if(doc.length>0){
                        doc.forEach(function(element) {
                            tags_id.push(element._id); 
                        })
                        return callback(tags_id)
                    }
                })
            }
            var listag = tagidtrung(function (listtag) {
                tagfinish(listtag);
            });

            function tagfinish(tag_id){
                if (tag_id === Array) {
                   tag_id = tag_id.map(mongoose.Types.ObjectId);
                }
                atnew = new Article({
                    title: title,
                    body: body,
                    slug: slug,
                    des: des,
                    created_by_id: new mongoose.mongo.ObjectID(created_by_id),
                    category_id: category_id,
                    tags_id :tag_id,
                    image_id: new mongoose.mongo.ObjectID(image_id),
                });
                atnew.save(function (err, doc) {
                    if (err) return callback({
                        status : 'error',
                        messages: err,
                    });
                    return callback({
                        status: 'ok',
                        data : doc
                    });
                })
            } 
        },
        update: function (_id, title, callback) {
            Category.update({
                _id: new mongoose.mongo.ObjectID(_id)
            }, {
                $set: {
                    title: title,
                }
            }, function (err, doc) {
                if (err) return callback(false);
                return callback(doc);
            });
        },
        del: function (_id, callback) {
            Category.findOneAndRemove({
                _id: new mongoose.mongo.ObjectID(_id)
            }, function (err, doc) {
                if (err) return callback(err);
                return callback(doc);
            });
        }
    };
    var Imagedb = {
        list : function (callback) {
            Image.find()
            .sort({created_at: -1})
            .limit(3)
            .exec(function (err,data) {
                 if (err) return callback(err);
                return callback(data);
            })
        },
        create: function (path, size, type, callback) {
            path = path.replace(/public/, "").replace(/\\/g, "/");
            var img = new Image({
                path: path,
                size: size,
                type: type
            });
            img.save(function (error, doc) {
                if (error) {
                    var errors = Object.keys(error.errors).map(function (key) {
                        return error.errors[key].message;
                    });
                    errors = JSON.stringify(errors);
                    return callback(errors);
                } else return callback(doc);
                return callback(doc);
            })
        }
    };
    var Global ={
        get : function (callback) {
            var globaldb;
            
        }
    }
    return {
        User: Userdb,
        Category: Categorydb,
        Article: Articledb,
        Image: Imagedb,
        Tag : TagsDB
    };
}

module.exports = DB();