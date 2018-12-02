exports.twitterMapper = profile => {
  const user = {
    id: "twitter_" + profile.id,
    name: profile.username,
    displayName: profile.displayName,
    email: profile.emails[0].value,
    photo: profile.photos[0].value.replace(/_normal/, "")
  };
  return user;
};

exports.googleMapper = profile => {
  const user = {
    id: "google_" + profile.id,
    name: profile.displayName,
    displayName: profile.displayName,
    email: profile.emails[0].value,
    photo: profile.photos[0].value.replace(/sz=50/gi, "sz=250")
  };
  return user;
};

exports.githubMapper = profile => {
  const user = {
    id: "github_" + profile.id,
    name: profile.username,
    displayName: profile.displayName,
    email: profile.emails[0].value,
    photo: profile.photos[0].value
  };
  return user;
};
