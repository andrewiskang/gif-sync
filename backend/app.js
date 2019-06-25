var createError = require('http-errors');
var express = require('express');
var fileUpload = require('express-fileupload');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');


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
app.get('/convert', (req, res, next) => {
  var directory = `${__dirname}/public/files/`
  var videoPath
  var audioPath

  // pull video and audio filepath
  // if multiple files match, the last match will be selected
  let files = fs.readdirSync(directory);
  for (let i in files) {
    let fileName = files[i].substr(0, files[i].lastIndexOf('.'))
    if (fileName == "videoFile") {
      videoPath = directory+files[i]
    }
    else if (fileName == "audioFile") {
      audioPath = directory+files[i]
    }
  }

  // exit if video and audio files do not both exist
  if (!(videoPath && audioPath)) {
    return res.status(500).send("Not all files uploaded!")
  }

  // combine video and audio inputs, with duration limited to 10 minutes
  ffmpeg.ffprobe(audioPath, function(err, metadata) {
    var duration = Math.min(metadata.format.duration, 600)

    ffmpeg()
      .input(videoPath)
      .inputOptions('-stream_loop -1')
      .input(audioPath)
      .output(`${__dirname}/public/files/outputFile.mp4`)
      .outputOptions(
        '-map', '0:v',
        '-map', '1:a',
        '-t', duration
      )
      // ffmpeg succeeded
      .on('end', function() {                    
        // clean up video, audio files after usage
        for (let i in files) {
          let fileName = files[i].substr(0, files[i].lastIndexOf('.'))
          if (fileName == "videoFile" || fileName == "audioFile") {
            fs.unlink(directory+files[i], (err) => {
              if (err) {
                console.log('error:', err)
              }
            })
          }
        }
        console.log('conversion ended')
        return res.json({
          file: `public/files/outputFile.mp4`
        })
      })
      // ffmpeg failed
      .on('error', function(err){
        console.log('error:', err)
        return res.status(500).send(err)
      })
      .run()
  })
})

// streams video to video players
app.get('/video', function(req, res) {
  const path = `${__dirname}/public/files/outputFile.mp4`
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] 
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
})

// post request handler for clearing all files from directory
app.delete('/refresh', (req, res, next) => {
  const directory = `${__dirname}/public/files/`
  
  fs.readdir(directory, (err, files) => {
    if (err) return res.status(500).send(err)

    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) return res.status(500).send(err)
      })
    }
  })
  
  return res.send(200)
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error')
})


module.exports = app
