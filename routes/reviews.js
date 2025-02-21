const express = require("express");
const reviewsRoutes = express.Router();
const {page_rait,add_rait} = require("../controllers/reviews");

reviewsRoutes.post("/page_rait", page_rait);
reviewsRoutes.post("/add_rait", add_rait);

module.exports = {reviewsRoutes};