const { pool } = require("../utils/db");


const Technicalsupport = (req, res,next) => {
    res.render("Technicalsupport", { title: "=>Technical" });
    res.end();
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
  module.exports = {Brokers,Technicalsupport,Viewproducts}; 