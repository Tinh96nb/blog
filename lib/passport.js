var passport = require('passport')
var localStrategy = require('passport-local').Strategy;
require('../models/connect');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/User');

/* 
Được gọi khi có router dùng passport authencate, xử lý đàu tiên trong passport
các para, là các name trong req.
*/
passport.use('local.login', new localStrategy({
        // Bật param req cho fucntion sau. 
        passReqToCallback: true
    },
    function(req, username, password, done) {
        //validate req
        req.checkBody('username', 'Username bao gồm chữ cái hoặc số từ 4-30 kí tự.').isLength({ min: 4, max: 30 }).isAlphanumeric();
        req.checkBody('password', 'Không được bỏ trống password').notEmpty();
        var errs = req.validationErrors();
        /* add error to messsage */
        if (errs) {
            var messages = [];
            errs.forEach(function(err) {
                messages.push(err.msg);
            });
            return done(null, false, req.flash('error', messages));
        }
        /* Tìm kiếm tên người dùng trong database */
        User.findOne({ user_name: username }, function(err, user) {
            if (err) {
                return done(err);
            } else if (!user) {
                return done(null, false, { message: "Người dùng không tồn tại." })
            } else {
                /* Check password */
                bcrypt.compare(password, user.password,function(err,res) {
                    if (res) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: "Sai mật khẩu." });
                    }
                });
            }
        })
    }
));

/* 
 Lưu dữ liệu người dùng vào cookie nếu đã qua được chứng thực.
 @pram1 : là đối tượng được bên chứng thực trả về trong hàm done().
 @param2: đối tượng done để tiếp tục trả lại.
 */
passport.serializeUser(function(user, done) {
    done(null, user);
});

/* 
 Dùng để check cookie đã lưu cho các trang khác. 
 @param1 : là đối tượng từ Serialize trả lại trong hàm done().
 @param2 : là đối tượng done để passport xử lý.
 */
passport.deserializeUser(function(username, done) {
    User.findOne({ user_name: username.user_name }, function(err, user) {
        if (err) {
            return done(err);
        } else if (!user) {
            return done(null, false, { msg: "Người dùng không tồn tại." })
        } else {
            return done(null, user);
        }
    })
});