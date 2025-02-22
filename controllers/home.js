const { pool } = require("../utils/db");

const Technicalsupport = (req, res, next) => {
  res.render("Technicalsupport", { title: "=>Technical" });
  res.end();
};

const Profile = (req, res, next) => {
  if (!req.session.userId) {
    console.log(req.session.userId);
    return res
      .status(401)
      .render("404", { message: "Unauthorized", errors: null });
  }

  const userId = req.session.userId;
  const userRole = req.session.role;

  let query = "";
  if (userRole === "broker") {
    query =
      "SELECT id,name, emil, role, phone,password, image, details, Facebook_account,created_at, website, Instagram_account FROM brokers WHERE id = ?";
  } else {
    query =
      "SELECT id,username, email,password, role, phone, profile_picture,created_at FROM users WHERE id = ?";
  }

  console.log(userId);
  console.log(userRole);

  pool.query(query, [userId], (err, results) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.render("404", { message: "Database error", errors: null });
    }
    if (results.length === 0) {
      console.log(
        "❌ User not found in",
        userRole === "broker" ? "brokers" : "users"
      );
      return res.render("404", { message: "User not found", errors: null });
    }

    if (userRole === "broker") {
      res.render("Profilebroker", { broker: results[0] });
    } 
    else if (userRole === "seller") {
      res.render("Profileselers", { user: results[0] ,message: "hi"});
    }
    else {
      res.render("Profile", { user: results[0] });
    }
  });
};

const Brokers = (req, res, next) => {
  const query = "SELECT * FROM brokers";
  pool.query(query, (err, rows) => {
    if (err) return next(err);
    res.render("Brokers", { brokers: rows,message:null });
  });
};

const Viewproducts = (req, res, next) => {
  pool.query("SELECT * FROM products", (err, rows) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Error fetching products" });
    }
    res.render("Viewproducts", { products: rows });
  });
};

module.exports = { Brokers, Technicalsupport , Viewproducts , Profile };
