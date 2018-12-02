require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const http = require("http");
const passport = require("passport");
const session = require("express-session");
const auth = require("./lib/auth");
const db = require("./db");
const api = require("./app/api");
const cors = require("cors");
const socketio = require("socket.io");
const authRouter = require("./lib/auth.router");
const passportInit = require("./lib/passport.init");
const { SESSION_SECRET, CLIENT_ORIGIN } = require("./config");
const app = express();
const morgan = require("morgan");
let server;

// If we are in production we are already running in https
server = http.createServer(app);

// Setup for passport and to accept JSON objects
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
passportInit();

app.use(bodyParser.urlencoded({ extended: true }));

// log
// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(
  path.join(__dirname, "log", "access.log"),
  {
    flags: "a"
  }
);

// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

// Accept requests from our client
app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

// saveUninitialized: true allows us to attach the socket id to the session
// before we have authenticated the user
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);

// Connecting sockets to the server and adding them to the request
// so that we can access them later in the controller
const io = socketio(server);
app.set("io", io);

// wake Heroku instance
app.get("/wake-up", (req, res) => res.send("👍"));

// Direct all other requests to auth router
app.use("/", authRouter);

// logged in user via JWT
app.get("/api/user", auth.checkToken, api.getUser);

// ==== History CRUD ====
// get a users history
app.get("/api/history", auth.checkToken, api.getHistory);

// add to a users history
app.post("/api/history", auth.checkToken, api.addHistory);

// update a stored users history row
app.put("/api/history", auth.checkToken, api.updateHistory);

// delete a row from a users history
app.delete("/api/history", auth.checkToken, api.deleteHistory);

// === init DB on startup ===
var setupSql = fs.readFileSync("setup.sql").toString();
db.query(setupSql);

const PORT = process.env.PORT || 8080;
server.listen(PORT, err => {
  if (err) {
    console.log(err);
  }
  console.info(`==> 🌎 app is listening on http://localhost:${PORT}.`);
});
