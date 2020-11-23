import createError = require('http-errors');
import express = require('express');
import path = require('path');
import cookieParser = require('cookie-parser');
import logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var {TemperatureDataRoute} = require("./routes/TemperatureDataRoute");

const runner = async () => {
  var app = express();

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
  // @ts-ignore
  app.use((req, res, next) => {
    next(createError(404));
  });

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

}
runner();
