const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const MongoStore = require("connect-mongo");
const User = require("./models/user");
const bcrypt = require("bcryptjs");

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const messageRouter = require("./routes/message");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Db connection
mongoose.set("strictQuery", false);
const dbUrl = process.env.DB_URL;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
}

app.use(
  session({
    secret: process.env.SECRET,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
      collectionName: "sessions",
    }),
    resave: false,
    saveUninitialized: true,
  }),
);
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ email: username });
        if (!user) {
          return done(null, false, { message: "Incorrect Email or password" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect Email or password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.use(passport.initialize());
app.use(passport.session());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/messages", messageRouter);

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
