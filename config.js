const providers = ["twitter", "google", "github"];

const callbacks = providers.map(provider => {
  return process.env.NODE_ENV === "production"
    ? `https://rejection-api.herokuapp.com/${provider}/callback`
    : `http://127.0.0.1:8080/${provider}/callback`;
});

const [twitterURL, googleURL, githubURL] = callbacks;

exports.CLIENT_ORIGIN =
  process.env.NODE_ENV === "production"
    ? ["https://rejection.netlify.com", "https://rejection.herokuapp.com"]
    : ["http://127.0.0.1:3003", "http://localhost:3003"];

exports.TWITTER_CONFIG = {
  consumerKey: process.env.TWITTER_KEY,
  consumerSecret: process.env.TWITTER_SECRET,
  callbackURL: twitterURL,
  includeEmail: true
};

exports.GOOGLE_CONFIG = {
  clientID: process.env.GOOGLE_KEY,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: googleURL
};

exports.GITHUB_CONFIG = {
  clientID: process.env.GITHUB_KEY,
  clientSecret: process.env.GITHUB_SECRET,
  callbackURL: githubURL,
  scope: 'user:email',
};
