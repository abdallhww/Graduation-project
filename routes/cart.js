const express = require("express");
const cartRoutes = express.Router();
const { get_user,viewCart,deleteitem,additem } = require("../controllers/cart");
const { pool } = require("../utils/db");

cartRoutes.get("/get_user", get_user);

cartRoutes.get("/cart/:userId",viewCart );

cartRoutes.post("/cart/delete",deleteitem);

cartRoutes.post("/add-to-cart",additem);

module.exports = { cartRoutes };