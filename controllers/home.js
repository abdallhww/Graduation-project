const { pool } = require("../utils/db");


const Technicalsupport = (req, res,next) => {
    res.render("Technicalsupport", { title: "=>Technical" });
    res.end();
  };

const Profile = (req, res, next) => {
    if (!req.session.userId) {
      console.log(req.session.userId);
        return res.status(401).render("404", { message: "Unauthorized" ,errors:null});
    }
    pool.query(
        "SELECT username, email, role, phone, profile_picture FROM users WHERE id = ?",
        [req.session.userId],
        (err, results) => {
            if (err) {
                return res.render("404", { message: "Database error",errors:null});
            }
            if (results.length === 0) {
                return res.render("404", { message: "User not found",errors:null});
            }
            res.render("profile", {user: results[0],});
        }
    );
};


  const Brokers = (req, res, next) => {
    const query = 'SELECT * FROM brokers';
    pool.query(query, (err, rows) => {
      if (err) return next(err); // تمرير الخطأ إلى middleware الخطأ
      res.render('Brokers', { brokers: rows });
    });
  };


  const Viewproducts = (req, res, next) => {
    pool.query("SELECT * FROM products", (err, rows) => {
      if (err) {
        console.error('Error fetching products:', err);
        return res.status(500).json({ error: "Error fetching products" });
      }
      res.render("Viewproducts", { products: rows });

    });
  };



  module.exports = {Brokers,Technicalsupport,Viewproducts,Profile}; 