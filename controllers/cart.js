const { pool } = require("../utils/db");

  const get_user = (req, res, next) => {
    if (req.session.userId) {
        console.log("from get_user "+req.session.userId); // طباعة userId في السجل
        return res.json({ userId: req.session.userId }); // إضافة return لإيقاف التنفيذ بعد الإرسال
    } else {
        return res.status(401).json({ error: "لم يتم تسجيل الدخول" }); // إضافة return
    }
};

const viewCart = (req, res) => {
    const userId = req.params.userId;

    const cartQuery = `
        SELECT c.id AS cart_item_id, c.product_id, p.name, p.image, p.price 
        FROM cart c 
        JOIN products p ON c.product_id = p.id 
        WHERE c.user_id = ?
    `;

    pool.query(cartQuery, [userId], (err, results) => {
        if (err) {
            console.error("خطأ في جلب عناصر السلة:", err);
            return res.status(500).send("خطأ في الخادم");
        }

        let totalPrice = 0;
        results.forEach(item => {
            totalPrice += parseFloat(item.price);
        });

        res.render('cart', {
            cartItems: results,
            userId,
            totalPrice: totalPrice.toFixed(2)
        });
    });
};

const deleteitem = (req, res) => {
    const { cart_item_id, product_id, user_id } = req.body;

    const deleteQuery = "DELETE FROM cart WHERE id = ?";
    pool.query(deleteQuery, [cart_item_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('خطأ أثناء حذف المنتج');
        }

        const updateStockQuery = "UPDATE products SET stock_quantity = stock_quantity + 1 WHERE id = ?";
        pool.query(updateStockQuery, [product_id], (stockErr) => {
            if (stockErr) {
                console.error("خطأ في تحديث الكمية:", stockErr);
                return res.status(500).send('تم الحذف لكن فشل تحديث الكمية');
            }

            res.redirect(`/cart/${user_id}`);
        });
    });
};

const additem = (req, res) => {
    const { userId, productId } = req.body;

    // تحقق من الكمية
    const checkStockQuery = 'SELECT stock_quantity FROM products WHERE id = ?';
    pool.query(checkStockQuery, [productId], (err, results) => {
        if (err) {
            console.error("Error checking stock:", err);
            return res.status(500).json({ success: false, message: "خطأ في التحقق من الكمية" });
        }

        if (results.length === 0 || results[0].stock_quantity <= 0) {
            return res.status(400).json({ success: false, message: "الكمية غير متوفرة" });
        }

        // إضافة للسلة
        const insertCartQuery = 'INSERT INTO cart (user_id, product_id) VALUES (?, ?)';
        pool.query(insertCartQuery, [userId, productId], (insertErr) => {
            if (insertErr) {
                console.error("Error inserting into cart:", insertErr);
                return res.status(500).json({ success: false, message: "خطأ في قاعدة البيانات" });
            }

            // تنقيص الكمية
            const updateStockQuery = 'UPDATE products SET stock_quantity = stock_quantity - 1 WHERE id = ?';
            pool.query(updateStockQuery, [productId], (updateErr) => {
                if (updateErr) {
                    console.error("Error updating stock quantity:", updateErr);
                    return res.status(500).json({ success: false, message: "خطأ في تحديث الكمية" });
                }

                res.json({ success: true });
            });
        });
    });
};

module.exports = { get_user,viewCart,deleteitem,additem};  