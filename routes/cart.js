const express = require("express");
const cartRoutes = express.Router();
const {add_to_cart,viwe_cart} = require("../controllers/cart");

cartRoutes.post("/add_to_cart", add_to_cart);
cartRoutes.post("/viwe_cart", viwe_cart);

module.exports = {cartRoutes};