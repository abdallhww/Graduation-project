const express = require("express");
const cartRoutes = express.Router();
const { get_user } = require("../controllers/cart");
const { pool } = require("../utils/db");

cartRoutes.get("/get_user", get_user);

// إضافة منتج إلى السلة
cartRoutes.post('/add-to-cart', (req, res) => {
    const { userId, productId } = req.body;

    pool.query(
        'INSERT INTO cart (user_id, product_id) VALUES (?, ?)',
        [userId, productId],
        (error, result) => {
            if (error) {
                console.error("Error inserting into cart:", error);
                return res.status(500).json({ success: false, message: "Database error" });
            }

            res.json({ success: true });
        }
    );
});

// عرض المنتجات في السلة
cartRoutes.get('/cart/:userId', (req, res) => {
    const userId = req.params.userId;

    const query = `
        SELECT p.id, p.name, p.price, p.image 
        FROM cart c 
        JOIN products p ON c.product_id = p.id 
        WHERE c.user_id = ?
    `;

    pool.query(query, [userId], (err, cartItems) => {
        if (err) {
            console.error(err);
            return res.status(500).send('خطأ في جلب المنتجات');
        }

        res.render('cart', { cartItems });
    });
});

module.exports = { cartRoutes };