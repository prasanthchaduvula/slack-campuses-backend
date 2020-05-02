var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var passport = require("passport");
var mongoose = require("mongoose");
var cors = require("cors");

// connect mongo
var mongoServer = "mongodb://localhost/fomo-api";
mongoose.connect(
  mongoServer,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  (err) => {
    console.log(err ? err : "mongodb connected");
  }
);

var app = express();
// require passport strategy

app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// handling routes
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var campusRouter = require("./routes/campus");
var channelsRouter = require("./routes/channels");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
require("./modules/passport");
app.use("/", indexRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/campus", campusRouter);
app.use("/api/v1/channels", channelsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
