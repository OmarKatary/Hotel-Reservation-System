var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
var passport = require("passport");
var session = require("express-session");
var flash = require("connect-flash");
var MemoryStore = require("session-memory-store")(session);

var DB = require("./db/connection");
var initPassport = require("./db/passport")(passport);

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "ay habal",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
    store: new MemoryStore()
  })
);

app.use(function (req, res, next) {
  req.con = DB.con;
  next();
});

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.use(function(req, res, next){
  res.locals.user = req.user;
  next();
});

app.use("/", require("./routes/indexRoute")(passport));
app.use("/hotels", require("./routes/hotelsRoute"));
app.use("/user", require("./routes/userRoute"));
app.use("/reservation", require("./routes/reservationRoute"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log("Cannot find path: " + req.path);
  next(createError(404));
});

// error handler, if the request passes through the routes
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  console.log(err);
  res.render("error");
});

module.exports = app;
