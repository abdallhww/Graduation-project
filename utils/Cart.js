const db = require("./db");

class Cart {
    static addToCart(userId, productId, callback) {
        const checkQuery = "SELECT * FROM carts WHERE user_id = ? AND product_id = ?";
        db.query(checkQuery, [userId, productId], (err, results) => {
            if (err) return callback(err);

            if (results.length > 0) {
                const updateQuery = "UPDATE carts SET quantity = quantity + 1 WHERE user_id = ? AND product_id = ?";
                db.query(updateQuery, [userId, productId], callback);
            } else {
                const insertQuery = "INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, 1)";
                db.query(insertQuery, [userId, productId], callback);
            }
        });
    }

    static getCart(userId, callback) {
        const query = `
            SELECT products.id, products.name, products.price, products.image, carts.quantity 
            FROM carts 
            JOIN products ON carts.product_id = products.id 
            WHERE carts.user_id = ?
        `;
        db.query(query, [userId], callback);
    }
}

module.exports = Cart;
