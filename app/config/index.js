module.exports = (function() {

  if (process.env.NODE_ENV === "development") {
    return require("./config.dev.js");
  }
  return require("./config.pro.js");

}());
