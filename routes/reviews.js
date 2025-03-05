const express = require("express");
const reviewsRoutes = express.Router();
const {add_rait,viwecommint} = require("../controllers/reviews");

reviewsRoutes.post("/evaluate",add_rait);

reviewsRoutes.post("/comment",viwecommint);

module.exports = {reviewsRoutes};