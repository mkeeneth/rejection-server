let jwt = require("jsonwebtoken");

const options = {
  expiresIn: '2h', // expires in 2 hours
  issuer: 'matt.keeneth'
};

let createToken = id =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, options);

let checkToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase
  // return error when missing!
  if (token == null) {
    return res.status(400).json({
      success: false,
      message: "Token header is missing!"
    });
  }
  if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, options, (err, decoded) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: "Token is not valid"
        });
      } else {
        req.decoded = decoded;  // this is the user id encoded on jwt creation
        next();
      }
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Auth token is not supplied"
    });
  }
};

module.exports = {
  createToken: createToken,
  checkToken: checkToken
};
