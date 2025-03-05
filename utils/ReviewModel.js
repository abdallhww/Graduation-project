const pool = require("./db");

const ReviewModel = {
  addReview: async (user_id, broker_id, rating, review) => {
    const query = "INSERT INTO reviews (user_id, broker_id, rating, review) VALUES (?, ?, ?, ?)";
    await pool.promise().query(query, [user_id, broker_id, rating, review || null]);
  }
};

module.exports = ReviewModel;