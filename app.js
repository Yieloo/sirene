//Initialisation des variables
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require("fs");
var expressJwt = require('express-jwt');

//Chargement des routes
var index = require('./routes/index');
var companies = require('./routes/companies');
var login = require('./routes/login');

//Démarre du framework NodeJS EXPRESS
var app = express();

// Chargement de la base MongoDB
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://'+config.mongo.user+':'+config.mongo.user+'@'+config.mongo.host+'/'+config.mongo.database)
    .then(() =>  console.log('connection succesful'))
.catch((err) => console.error(err));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Récupération de la clé publique du serveur
var publicKey = fs.readFileSync('/home/vagrant/.ssh/public_key.pem');


//Initialisation du path des routes
app.use('/', index);
app.use('/login', login);

//Initialisation du path de la route protégée '/companies'
// En indiquant à expressJWT de vérifier le JWT Token dans le header
//de CHAQUE requete HTTP avec la clé publique passée en paramètre
//afin de vérifier si elle a été générée par la clé privée du serveur.
//app.use('/companies', expressJwt({ secret: publicKey }), companies);

//Sans l'authentification JWT
app.use('/companies', companies);

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
  res.render('error');
});

module.exports = app;