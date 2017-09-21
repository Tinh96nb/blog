var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var engine = require('ejs-locals');
var expressValidate = require('express-validator');
var expressSession = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
require('./lib/passport');


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidate());
app.use(expressSession({
    secret: 'tinhpham',
    saveUninitialized: true,
    resave: true,
    cookie: {
        maxAge: 1000 * 60 * 5
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.title = "PDT Blog";
    if (res.locals.login) {
        res.locals.user = req.session.passport.user;
    }
    next();
})

app.use('/', index);
app.use('/user', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', { title: "Page Error - Ôi hỏng :(" });
});
app.listen(process.env.PORT || 3000, function () {
    console.log('Server running!')
});
module.exports = app;