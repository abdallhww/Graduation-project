const { pool } = require("../utils/db");

const Viewproducts = (req, res, next) => {

  const userId = req.session.userId;

  console.log(userId);

    pool.query("SELECT * FROM products", (err, rows) => {
      if (err) {
        console.error("Error fetching products:", err);
        return res.status(500).json({ error: "Error fetching products" });
      }
      res.render("Viewproducts", { products: rows });
    });
  };

  const ViewFoodProducts = (req, res, next) => {
    const userId = req.session.userId;

    pool.query("SELECT * FROM products WHERE category = 'Food'", (err, rows) => {
        if (err) {
            console.error("Error fetching food products:", err);
            return res.status(500).json({ error: "Error fetching food products" });
        }
        res.render("Viewproducts", { products: rows,userId });
    });
};

const ViewElectronicsProducts = (req, res, next) => {
  const userId = req.session.userId;

  pool.query("SELECT * FROM products WHERE category = 'Electronics'", (err, rows) => {
      if (err) {
          console.error("Error fetching electronics products:", err);
          return res.status(500).json({ error: "Error fetching electronics products" });
      }
      res.render("Viewproducts", { products: rows,userId });
  });
};

const ViewClothingProducts = (req, res, next) => {
  const userId = req.session.userId;

  pool.query("SELECT * FROM products WHERE category = 'Clothing'", (err, rows) => {
      if (err) {
          console.error("Error fetching clothing products:", err);
          return res.status(500).json({ error: "Error fetching clothing products" });
      }
      res.render("Viewproducts", { products: rows,userId });
  });
};

const ViewFurnitureProducts = (req, res, next) => {
  const userId = req.session.userId;

  pool.query("SELECT * FROM products WHERE category = 'Furniture'", (err, rows) => {
      if (err) {
          console.error("Error fetching furniture products:", err);
          return res.status(500).json({ error: "Error fetching furniture products" });
      }
      res.render("Viewproducts", { products: rows,userId });
  });
};

const ViewBeautyProducts = (req, res, next) => {
  const userId = req.session.userId;

  pool.query("SELECT * FROM products WHERE category = 'Beauty'", (err, rows) => {
      if (err) {
          console.error("Error fetching beauty products:", err);
          return res.status(500).json({ error: "Error fetching beauty products" });
      }
      res.render("Viewproducts", { products: rows,userId});
  });
};

const ViewBooksProducts = (req, res, next) => {
  const userId = req.session.userId;

  pool.query("SELECT * FROM products WHERE category = 'Books'", (err, rows) => {
      if (err) {
          console.error("Error fetching books products:", err);
          return res.status(500).json({ error: "Error fetching books products" });
      }
      res.render("Viewproducts", { products: rows,userId});
  });
};

const ViewPerfumesProducts = (req, res, next) => {
  const userId = req.session.userId;
  pool.query("SELECT * FROM products WHERE category = 'Perfumes'", (err, rows) => {
      if (err) {
          console.error("Error fetching perfumes products:", err);
          return res.status(500).json({ error: "Error fetching perfumes products" });
      }
      res.render("Viewproducts", { products: rows,userId});
  });
};

  
  module.exports = {Viewproducts,ViewFoodProducts,ViewElectronicsProducts,
    ViewClothingProducts,ViewFurnitureProducts,ViewBeautyProducts,ViewBooksProducts,ViewPerfumesProducts};