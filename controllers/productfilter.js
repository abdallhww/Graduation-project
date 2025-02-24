const { pool } = require("../utils/db");

const Viewproducts = (req, res, next) => {
    pool.query("SELECT * FROM products", (err, rows) => {
      if (err) {
        console.error("Error fetching products:", err);
        return res.status(500).json({ error: "Error fetching products" });
      }
      res.render("Viewproducts", { products: rows });
    });
  };
  
  module.exports = {Viewproducts };