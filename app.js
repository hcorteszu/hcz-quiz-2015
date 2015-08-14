var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');
var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(partials());
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended : true }));
app.use(cookieParser('Quiz 2015'));
app.use(session({ secret: 'keyboard cat', cookie: {maxAge: 60000}, resave: true, saveUninitialized: true}));
//app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinamicos:
app.use(function(req, res, next) {

	// guardar path en session.redir para  login 
	if (!req.path.match(/\/login|\/logout/)) {
		req.session.redir = req.path;
	}
	// Hacer visible req.session en las vistas
	res.locals.session = req.session;
	next();
});

var anterior = 0
app.use(function(req, res, next) {
  if(req.session.user) {
  	 if (anterior===0) 
       {
       	anterior=Date.now();
       }
  	nueva_sesion = Date.now();
 /*   console.log('Nueva sesion 1:', nueva_sesion);
    console.log('Anterior sesion :', anterior);    */
    tiempo = (nueva_sesion - anterior);
    console.log('Tiempo consumido :', tiempo); 
    if (tiempo>120000)
      {
        anterior=0;
        delete req.session.user;
        console.log('Sesion desactivada por inactiva por mas de dos minutos');
//      return res.redirect('/logout');
    }else{
    	anterior=Date.now();
    }}else{
 
  };
next();
});


app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;