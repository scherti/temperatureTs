import createError = require('http-errors');
import express = require('express');
var cors = require('cors');
import path = require('path');
import cookieParser = require('cookie-parser');
import logger = require('morgan');
import config from './ormconfig';

// import indexRouter = require('./routes/index');
// import usersRouter = require('./routes/users');
import {TemperatureDataRoute} from "./routes/TemperatureDataRoute";
import {createConnection} from "typeorm";

var app = express();
app.use(cors());

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
TemperatureDataRoute.getInstance(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// start = async (): Promise<void> => {
createConnection(config);
// };

// error handler
// @ts-ignore
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
