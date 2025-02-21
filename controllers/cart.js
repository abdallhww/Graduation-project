const { pool } = require("../utils/db");

const add_to_cart = (req, res, next) => {
    res.render("", { });
    res.end();
  };

const viwe_cart = (req, res, next) => {
    res.render("", { });
    res.end();
  };

module.exports = { add_to_cart, viwe_cart};  