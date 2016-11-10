const path = require("path");
const fs = require("fs");

const helmet = require("helmet");
const csurf = require("csurf");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const log = require("debug")("server:log");
const error = require("debug")("server:error");

const express = require("express");
const session = require("express-session");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const config = require("./config");
const mongoose = require("./mongoose")(config);

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const stylus = require("stylus");

function styles() {
  const content = fs.readFileSync(path.join(__dirname, "styles", "index.styl"));
  stylus(content.toString("utf8"))
    .set("paths", [path.join(__dirname, "styles")])
    .set("filename", "index.styl")
    .render((err, css) => {
      if (err) {
        return error(err);
      }
      fs.writeFileSync(path.join(__dirname, "public", "index.css"), css);
    });
}

fs.watch("styles", (e, filename) => styles());

styles();

passport.use(new LocalStrategy(function(username, password, done) {
  const User = mongoose.model("user");
  User.findByCredentials(username, password).then((user) => {
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  }).catch((err) => {
    return done(err);
  });
}));

passport.serializeUser(function(user, done) {
  return done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  const User = mongoose.model("user");
  User.findById(id).then((user) => {
    return done(null, user);
  }).catch((err) => {
    return done(err);
  });
});

app.set("trust proxy", 1);
app.set("title", "Aster");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(helmet());
app.use(morgan("combined"));
app.use(express.static("public"));
app.use(session({ secret: "x3n0m04ph1c4l" }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

/**
 * Web
 *
 */
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/play", (req, res) => {
  res.render("play");
});

app.post("/register", (req, res) => {

});

app.post("/login",  passport.authenticate('local'));

/**
 * API
 *
 */

/**
 * WebSockets
 *
 */
io.on("connection", (socket) => {

});

server.listen(config.PORT);
