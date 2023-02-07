var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

///// start socket
const server = require('http').createServer(app);
const port = process.env.PORTx || 8080;
// const io = require('socket.io')(server);
const io = require('socket.io')(server,{
    cors: {origin: ["http://localhost:8080", "http://localhost:3000", "https://glitch.me", "https://cdpn.io"]}
  });
app.io = io;
io.on('connection', function(socket){
  console.log('a user connected');

  socket.emit('tx', 'msg');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
server.listen(port, function() {
  console.log(`Listening on port ${port}`);
}); 
///// end socket

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/////////////////// cors
const whitelist = [
  "http://localhost:3000",
  "http://localhost:8080",
  "https://glitch.me",
  "https://cdpn.io",
];
const corsOptions = {
  credentials: true, // This is important.
  origin: whitelist,
};

app.use(cors(corsOptions));
///////////////////

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

module.exports = app;
