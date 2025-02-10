const mysql = require("mysql2");

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "graduation-project",
  password: "AbdallhWael2002*",
});

module.exports = { pool };
