const pg = require("pg");

const config = {
  user: process.env.PGUSER || "rejection", // name of the user account
  password: process.env.PGPASS || "password",
  database: process.env.PGDATABASE || "rejection", // name of the database
  host: process.env.PGHOST || "127.0.0.1",
  max: process.env.PGMAXPOOL || 900, // max number of clients in the pool
  idleTimeoutMillis: 5000
};

const herokuConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: true
};

const { Pool } = require("pg");

let pool;
if (process.env.NODE_ENV == "production") {
  pool = new Pool(herokuConfig);
} else {
  pool = new Pool(config);
}

pool.on("error", err => {
  console.error("An idle client has experienced an error", err.stack);
});

module.exports = {
  // with query logging
  loggedQuery: async (text, params) => {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("executed query", { text, duration, rows: res.rowCount });
    return res;
  },
  // without query logging
  query: (text, params) => pool.query(text, params),
  // DB API functions
  getUserById: async userId => {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId
    ]);
    const user = ({
      id,
      username,
      displayname,
      email,
      photo,
      lastlogin
    } = rows[0]);
    return user;
  },
  getUserHistory: async userId => {
    const { rows } = await pool.query(
      "SELECT * FROM history WHERE userid = $1",
      [userId]
    );
    return rows;
  },
  addHistory: async (userId, newHistory) => {
    console.log(userId, newHistory);
    await pool.query("INSERT into history values ($1, $2, $3, $4, $5, $6)", [
      newHistory.id,
      userId,
      newHistory.status,
      newHistory.question,
      newHistory.askee,
      new Date()
    ]);
    // no error, we inserted a new record successfully
    return newHistory;
  },
  updateHistoryById: async (userId, updatedHistory) => {
    console.log(userId, updatedHistory);
    await pool.query("update history set status = $3, question = $4, askee = $5, timestamp = $6 where id = $1 and userid = $2", [
      updatedHistory.id,
      userId,
      updatedHistory.status,
      updatedHistory.question,
      updatedHistory.askee,
      new Date()
    ]);
    // no error, we updated a record successfully
    return updatedHistory;
  },
  deleteHistoryById: async (userId, id) => {
    console.log(userId, id);
    await pool.query("delete FROM history WHERE userid = $1 and id = $2", [
      userId,
      id
    ]);
    return true; 
  }
};
