const mongoose = require("mongoose");

const log = require("debug")("server:mongoose:log");
const error = require("debug")("server:mongoose:error");

module.exports = function(config) {

  const uri = `mongodb://${config.MONGO.HOST}:${config.MONGO.PORT}/${config.MONGO.DB}`;
  log(`connecting to: ${uri}`);

  mongoose.Promise = global.Promise;
  mongoose.connect(uri).then(() => {

    log("connected!");

  }).catch((err) => {

    error(err);

  });

  return mongoose;

};
