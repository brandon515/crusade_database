var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

var playersRouter = require('./routes/players');
var factionsRouter = require('./routes/factions');
var supplyTypesRouter = require('./routes/supply_types');
var rolesRouter = require('./routes/roles');
var ranksRouter = require('./routes/ranks');
var forcesRouter = require('./routes/forces');
var battlesRouter = require('./routes/battles');
var unitsRouter = require('./routes/units');
var goalsRouter = require('./routes/goals');
var informationRouter = require('./routes/information');
var victoriesRouter = require('./routes/victories');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/players', playersRouter);
app.use('/factions', factionsRouter);
app.use('/supply_types', supplyTypesRouter);
app.use('/roles', rolesRouter);
app.use('/ranks', ranksRouter);
app.use('/forces', forcesRouter);
app.use('/battles', battlesRouter);
app.use('/units', unitsRouter);
app.use('/goals', goalsRouter);
app.use('/information', informationRouter);
app.use('/victories', victoriesRouter);

// error handler
app.use(function(req, res, next) {
  res.sendStatus(404);
});

module.exports = app;
