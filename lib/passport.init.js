const passport = require("passport");
const { Strategy: TwitterStrategy } = require("passport-twitter");
const { OAuth2Strategy: GoogleStrategy } = require("passport-google-oauth");
const { Strategy: GithubStrategy } = require("passport-github");
const { TWITTER_CONFIG, GOOGLE_CONFIG, GITHUB_CONFIG } = require("../config");
const {
  twitterMapper,
  googleMapper,
  githubMapper
} = require("./profileToUser");
const db = require("../db"); // pg pool client

module.exports = () => {
  // Allowing passport to serialize and deserialize users into sessions
  passport.serializeUser((user, cb) => {
    console.log(`passport.serializeUser with id ${user.id}`);
    cb(null, user.id);
  });
  passport.deserializeUser(async (userId, cb) => {
    const user = ({
      id,
      username,
      displayname,
      email,
      photo,
      lastlogin
    } = await db.query("SELECT * FROM users WHERE id = $1", [userId]));
    console.log(`passport.deserializeUser id ${userId}, found ${user}`);
    cb(null, user);
  });

  // The callback that is invoked when an OAuth provider sends info
  const callbackTwitter = async (accessToken, refreshToken, profile, cb) => {
    const user = twitterMapper(profile);
    await addOrUpdateuser(user);
    cb(null, user);
  };

  const callbackGoogle = async (accessToken, refreshToken, profile, cb) => {
    const user = googleMapper(profile);
    await addOrUpdateuser(user);
    cb(null, user);
  };

  const callbackGithub = async (accessToken, refreshToken, profile, cb) => {
    const user = githubMapper(profile);
    await addOrUpdateuser(user);
    cb(null, user);
  };

  const addOrUpdateuser = async user => {
    // insert or update user in DB here
    console.log("User login, now update or insert them!");
    console.log(user);
    await db.query(
      `INSERT INTO users VALUES ($1,$2,$3,$4,$5) ON CONFLICT (id)
      DO UPDATE SET username = $2, displayname = $3, email = $4, photo = $5, lastlogin = NOW()`,
      [user.id, user.name, user.displayName, user.email, user.photo]
    );
  };

  // Adding each OAuth provider's strategy to passport
  passport.use(new TwitterStrategy(TWITTER_CONFIG, callbackTwitter));
  passport.use(new GoogleStrategy(GOOGLE_CONFIG, callbackGoogle));
  passport.use(new GithubStrategy(GITHUB_CONFIG, callbackGithub));
};
