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
    const userId = req.session.userId;
    const userRole = req.session.role;

    let query = "";
    if (userRole === "broker") {
        query = "SELECT name, emil, role, phone, image AS profile_picture FROM brokers WHERE id = ?";
    } else {
        query = "SELECT username, email, role, phone, profile_picture FROM users WHERE id = ?";
    }
    
    console.log(userId);
    console.log(userRole);

    pool.query(query, [userId], (err, results) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.render("404", { message: "Database error", errors: null });
        }
        if (results.length === 0) {
            console.log("❌ User not found in", userRole === "broker" ? "brokers" : "users");
            return res.render("404", { message: "User not found", errors: null });
        }
        res.render("profile", { user: results[0] });
    });
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