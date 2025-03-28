const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const h = require('connect-session-sequelize');
const bodyParser = require('body-parser');
const indexRouter = require('./routes');
const usersRouter = require('./routes/users');
const db = require('./models');
const User = require('./models/User');
const port = process.env.PORT || 3000;
const hostname = 'localhost';


const app = express();


app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));


db.sequelize.sync()
    .then(() => {
      console.log('Database Synced');
      return Promise.all([
        db.User.findOrCreate({
          where: {username: 'admin'},
          defaults: {username: 'admin', password: 'admin'}
        }),
        db.User.findOrCreate({
          where: {username: 'admin2'},
          defaults: {username: 'admin2', password: 'admin2'}
        })
      ]);
    }).then(() =>{
  console.log('Admin user created');
})
    .catch((err) => {
      console.log('Error syncing database');
      console.log(err);
    });


app.use(session(
    {secret: 'secret',
      resave: false,
      saveUninitialized: false
    }));



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

app.listen(port, hostname, () => {
  console.log(`Ready to receive requests to port ${port}.`);
});

module.exports = app;
