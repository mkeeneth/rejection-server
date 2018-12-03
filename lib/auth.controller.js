const auth = require("./auth");

exports.twitter = (req, res) => {
  const io = req.app.get("io");
  const user = req.user;
  user.token = auth.createToken(user.id);
  io.in(req.session.socketId).emit("twitter", user);
  //res.end();
  res.redirect('/after-auth.html');
};

exports.google = (req, res) => {
  const io = req.app.get("io");
  const user = req.user;
  user.token = auth.createToken(user.id);
  io.in(req.session.socketId).emit("google", user);
  //res.end();
  res.redirect('/after-auth.html');
};

exports.github = (req, res) => {
  const io = req.app.get("io");
  const user = req.user;
  user.token = auth.createToken(user.id);
  io.in(req.session.socketId).emit("github", user);
  //res.end();
  res.redirect('/after-auth.html');
};
