const express = require("express");
const reviewsRoutes = express.Router();
const {add_rait} = require("../controllers/reviews");

reviewsRoutes.post("/evaluate",add_rait);

module.exports = {reviewsRoutes};