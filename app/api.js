const db = require("../db");

const getUser = async (req, res) => {
  // get user from DB
  const user = await db.getUserById(req.decoded.id);
  res.json({ status: "👍", username: req.decoded.id, dbUser: user });
};

const getHistory = async (req, res) => {
  // get user history from DB
  const history = await db.getUserHistory(req.decoded.id);
  res.json({ status: "👍", username: req.decoded.id, history: history });
};

const addHistory = async (req, res) => {
  const newHistory = ({ id, status, question, askee } = req.body);
  const history = await db.addHistory(req.decoded.id, newHistory);
  res.json({ status: "👍", history: history });
};

const updateHistory = async (req, res) => {
  const newHistory = ({ id, status, question, askee } = req.body);
  const history = await db.updateHistoryById(req.decoded.id, newHistory);
  res.json({ status: "👍", history: history });
};

const deleteHistory = async (req, res) => {
  const id = req.query.id;
  await db.deleteHistoryById(req.decoded.id, id);
  res.json({ status: "👍" });
};

module.exports = {
  getUser,
  getHistory,
  addHistory,
  updateHistory,
  deleteHistory
};
