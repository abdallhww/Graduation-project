const { pool } = require("../utils/db");

const submitOrder = (req, res) => {
    const userId = req.session.userId;

    const cartQuery = `
        SELECT c.product_id, p.name AS product_name, p.price 
        FROM cart c 
        JOIN products p ON c.product_id = p.id 
        WHERE c.user_id = ?
    `;

    console.log("userid = " + userId);

    pool.query(cartQuery, [userId], (err, cartItems) => {
        if (err) return res.status(500).send('خطأ في جلب السلة');

        if (cartItems.length === 0) return res.render('full');

        const totalPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);

        const insertOrderQuery = `
            INSERT INTO orders (user_id, total_price, payment_method, status, created_at) 
            VALUES (?, ?, ?, 'قيد المعالجة', NOW())
        `;

        console.log("totalPrice = " + totalPrice);

        pool.query(insertOrderQuery, [userId, totalPrice, 'كاش'], (err, orderResult) => {
            if (err) return res.status(500).send('خطأ في إنشاء الطلب');

            const orderId = orderResult.insertId;
            console.log("orderId = " + orderId);

            // انضيف السعر وقت الشراء
            const itemsValues = cartItems.map(item => [
                orderId,
                item.product_id,
                item.product_name,
                1, // الكمية
                item.price // السعر وقت الشراء
            ]);

            const insertItemsQuery = `
                INSERT INTO order_items (order_id, product_id, product_name, quantity, product_price) 
                VALUES ?
            `;

            pool.query(insertItemsQuery, [itemsValues], (err) => {
                if (err) return res.status(500).send('خطأ في حفظ عناصر الطلب');

                const clearCartQuery = `DELETE FROM cart WHERE user_id = ?`;

                pool.query(clearCartQuery, [userId], (err) => {
                    if (err) console.warn('خطأ في حذف السلة بعد الطلب');

                    res.render('payment', {
                        order: {
                            id: orderId,
                            total: totalPrice,
                            created_at: new Date(),
                            payment_method: 'كاش',
                            orderId
                        }
                    });
                });
            });
        });
    });
};

const showPaymentPage = (req, res) => {
    const orderId = req.params.orderId;

    const query = `SELECT * FROM orders WHERE id = ?`;

    pool.query(query, [orderId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).send('الطلب غير موجود');
        }

        const order = results[0];
        res.render('payment', { order });
    });
};

const getUserOrders = (req, res) => {
    const userId = req.params.userId;

    const query = `
        SELECT orders.*, brokers.name AS broker_name
        FROM orders
        LEFT JOIN brokers ON orders.broker_id = brokers.id
        WHERE orders.user_id = ?
        ORDER BY orders.created_at DESC
    `;

    pool.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).send("حدث خطأ");
        }

        res.render('orders', { orders: results });
    });
};

module.exports = { submitOrder , showPaymentPage , getUserOrders };