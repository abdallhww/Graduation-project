const express = require("express");
const reviewsRoutes = express.Router();
const { pool } = require("../utils/db");

const { add_rait , viwecommint } = require("../controllers/reviews");

reviewsRoutes.post("/evaluate",add_rait);

reviewsRoutes.post("/comment",viwecommint);

reviewsRoutes.get('/reviews/:brokerId', async (req, res) => {
    const brokerId = req.params.brokerId;

    try {
        const [rows] = await pool.promise().query(
            'SELECT review, rating, created_at FROM reviews WHERE broker_id = ? ORDER BY created_at DESC',
            [brokerId]
        );

        // التأكد من أن "rows" تحتوي على بيانات
        if (!Array.isArray(rows) || rows.length === 0) {
            return res.render('no-reviews', { message: 'لا توجد تعليقات لهذا الوسيط' }); // عرض صفحة بدون تعليقات
        }

        const [query] =await pool.promise().query(
            'SELECT name, emil, phone, Facebook_account, image,details, Instagram_account, Rating FROM brokers WHERE id = ?',
            [brokerId]
        );

        // عرض التعليقات في صفحة HTML
        res.render('reviews', { reviews: rows, brokerId: brokerId,brokers:query});
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).render('error', { message: 'خطأ في جلب التعليقات' }); // عرض صفحة خطأ
    }
});



module.exports = { reviewsRoutes };