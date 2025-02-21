const { pool } = require("../utils/db");

const page_rait = (req, res, next) => {
    res.render("", { });
    res.end();
  };

const add_rait = (req, res, next) => {
    res.render("", { });
    res.end();
  };

module.exports = { page_rait,add_rait};  