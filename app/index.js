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
const passport = require("./passport")(config, mongoose);
const styles = require("./styles");
const routes = require("./routes");

app.set("trust proxy", 1);
app.set("title", "Aster");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(helmet());
app.use(morgan("combined"));
app.use(express.static("public"));
app.use(session({ secret: config.SECRET }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

/**
 * Web
 *
 */
app.use(routes);

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
