const express = require("express");
const reviewsRoutes = express.Router();
const { pool } = require("../utils/db");

const { add_rait , viwecommint , getBrokerReviews , getBrokerReviews2 } = require("../controllers/reviews");

reviewsRoutes.post("/evaluate", add_rait );

reviewsRoutes.post("/comment", viwecommint );

reviewsRoutes.get('/reviews/:brokerId', getBrokerReviews );

reviewsRoutes.get('/reviews2/:brokerId', getBrokerReviews2 );

module.exports = { reviewsRoutes };