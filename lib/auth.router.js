const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("./auth.controller");

// Setting up the passport middleware for each of the OAuth providers
const twitterAuth = passport.authenticate("twitter");
const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"]
});
const githubAuth = passport.authenticate("github", { scope: ["user:email"] });

// Routes for callbacks from each OAuth provider
router.get("/twitter/callback", twitterAuth, authController.twitter);
router.get("/google/callback", googleAuth, authController.google);
router.get("/github/callback", githubAuth, authController.github);

// This custom middleware allows us to attach the socket id to the session
// With that socket id we can send back the right user info to the right
// socket
router.use((req, res, next) => {
  req.session.socketId = req.query.socketId;
  next();
});

// Routes that are triggered on the client
router.get("/twitter", twitterAuth);
router.get("/google", googleAuth);
router.get("/github", githubAuth);

module.exports = router;
