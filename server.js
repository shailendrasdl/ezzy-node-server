var expressValidator = require('express-validator');
var exphbs      = require('express-handlebars');
var session     = require('express-session');
var bodyParser  = require('body-parser');
var passport    = require('passport');
var express     = require('express');
var path        = require('path');
var Sequelize   = require('sequelize');



//Models
var models = require("./app/models");

var app = express()


models.sequelize.sync().then(function() {
    console.log('Nice! Database looks fine')
}).catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!")
});


app.use(bodyParser.urlencoded({
    limit: '5mb',
    extended: true
}));


app.use(bodyParser.json({limit: '5mb'}));
app.use(expressValidator())

app.use(function (req, res, next) {
    var allowedOrigins = ['http://127.0.0.1:3000', 'http://127.0.0.1:9000', 'http://localhost:3000','http://localhost'];
    var origin = req.headers.origin;
    console.log("Origin: " + origin);
    if(allowedOrigins.indexOf(origin) > -1){
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS','POST','PUT');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, token, source, deviceid');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/app/failure', function(req,res,next){
    res.render("failure");
    return;
});

app.get('/app/success',  function(req,res,next){
    res.render("success");
    return;
});


//var ownerAuthRoute = require('./app/routes/ownerAuth.js')(app,passport,models);
var usersAuthRoute = require('./app/routes/usersAuth.js')(app, passport, models);
var sportsRoutes = require('./app/routes/sportsRoutes.js')(app, passport, models);
var usersRoutes = require('./app/routes/usersRoutes.js')(app, passport, models);
require('./app/config/passport/passport.js')(passport, models, app);

app.set('views', './app/views');
app.engine('hbs', exphbs({ extname: '.hbs'}));
app.set('view engine', '.hbs');

app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

var port = normalizePort(process.env.PORT || '3000');

function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
    return false;
}

app.listen(port, function(err) {
    if (!err)
        console.log("Service is live on port: " + port);
    else console.log(err)
});