const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", (req, res) => {
  res.render("index", {
    title: "Aster"
  });
});

router.get("/play", (req, res) => {
  res.render("play");
});

router.post("/register", (req, res) => {

});

router.post("/login",  passport.authenticate('local'));

module.exports = router;
