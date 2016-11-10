const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

module.exports = function(config, mongoose) {

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

  return passport;

};
