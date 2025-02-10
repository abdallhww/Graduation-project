const { pool } = require("../utils/db");


const Technicalsupport = (req, res,next) => {
    res.render("Technicalsupport", { title: "=>Technical" });
    res.end();
  };


  
const Brokers = (req, res,next) => {
    res.render("Brokers", { title: "=>Brokers" });
    res.end();
  };
  module.exports = {Brokers,Technicalsupport};
  

  const Viewproducts = (req, res, next) => {
    pool.query("SELECT * FROM products", (err, rows) => {
      if (err) {
        console.error('Error fetching products:', err);
        return res.status(500).json({ error: "Error fetching products" });
      }
      res.render("Viewproducts", { products: rows });
    res.end();
    });
  };
  module.exports = {Brokers,Technicalsupport,Viewproducts}; 
  /*const Viewproducts = (req, res, next) => {
    pool.query("SELECT * FROM products", (err, rows) => {
      if (err) {
        console.error('Error fetching products:', err);
        return res.status(500).json({ error: "Error fetching products" });
      }
      res.render("Viewproducts");
    res.end();
    });
  };*/