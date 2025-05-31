const mysql = require("mysql2");
require("dotenv").config();

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as ID ' + connection.threadId);
  connection.release(); // إطلاق الاتصال بعد التحقق
});
const getPool = () => {
  return pool;
};


module.exports = { pool,getPool };