const mysql = require("mysql2");

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "graduation-project",
  password: "AbdallhWael2002*",
});
/*pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as ID ' + connection.threadId);
  connection.release(); // إطلاق الاتصال بعد التحقق
});*/


module.exports = { pool };
