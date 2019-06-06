var createError = require('http-errors');
var express = require('express');
var fileUpload = require('express-fileupload');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var fs = require('fs')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use(cors());
app.options('*', cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// post request handler for uploads
app.post('/upload/:type', (req, res, next) => {
  let uploadFile = req.files.file
  let type = req.params.type
  let extension = path.extname(uploadFile.name)
  uploadFile.mv(
    `${__dirname}/public/files/${type}${extension}`,
    function (err) {
      if (err) {
        return res.status(500).send(err)
      }
      res.json({
        file: `public/files/${type}${extension}`,
      })
    },
  )
})

// get request handler for combining video and audio
app.get('/combine/:video-:audio', (req, res, next) => {
  uploadFile.mv(
    `${__dirname}/public/files/${fileName}`,
    function (err) {
      if (err) {
        return res.status(500).send(err)
      }
      res.json({
        file: `public/files/${req.files.file.name}`,
      })
    },
  )
})

/*
// post request handler for clearing uploaded file
app.delete('/delete/*', (req, res, next) => {
  const fileName = decodeURI(req.path).split("/").pop()
  fs.unlink(`${__dirname}/public/files/${fileName}`, (err) => {
    if (err) {
      return res.status(500).send(err)
    }
  })
})
*/
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


module.exports = app;
