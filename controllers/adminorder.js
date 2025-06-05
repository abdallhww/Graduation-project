const { pool } = require("../utils/db");

// عرض الطلبات
const showOrders = (req, res) => {
  const query = `
    SELECT 
      orders.id, 
      users.username, 
      orders.total_price, 
      orders.payment_method, 
      orders.status, 
      orders.created_at,
      orders.location,
      brokers.name AS broker_name
    FROM orders
    INNER JOIN users ON orders.user_id = users.id
    LEFT JOIN brokers ON orders.broker_id = brokers.id
    ORDER BY orders.created_at DESC
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error('خطأ أثناء جلب الطلبات:', err);
      return res.status(500).send('حدث خطأ في السيرفر');
    }
    res.render('showorderadmin', { orders: results });
  });
};


  const searchOrderItems = (req, res) => {
    const orderId = req.query.orderId;
  
    if (!orderId) {
        return res.render('searchOrderItems', { items: [], error: 'يجب إدخال رقم الطلب' });
    }
  
    const query = `
        SELECT 
            oi.product_name, 
            oi.quantity, 
            oi.product_price AS price,  -- ✅ السعر وقت الشراء
            p.category, 
            p.image
        FROM 
            order_items oi
        JOIN 
            products p ON oi.product_id = p.id
        WHERE 
            oi.order_id = ?
    `;
  
    pool.query(query, [orderId], (err, results) => {
        if (err) {
            console.error('خطأ أثناء جلب تفاصيل المنتجات:', err);
            return res.status(500).send('حدث خطأ في السيرفر');
        }
  
        if (results.length === 0) {
            return res.render('searchOrderItems', { items: [], error: 'لا توجد منتجات لهذا الطلب' });
        }
  
        res.render('searchOrderItems', { items: results, error: null });
    });
};

  const updateOrderStatus = (req, res) => {
    const { id, status } = req.body;
    pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id], (err, results) => {
      if (err) throw err;
      res.redirect('/showOrders'); // رجوع لصفحة الطلبات بعد التحديث
    });
  };


  const deleteOrder = (req, res) => {
    const { id } = req.body;
  
      const sql = "DELETE FROM orders WHERE id = ?";

      pool.query(sql,[id], (err, result) =>{
        if (err) {
            console.error("فشل في حذف طلب:", err);
            return res.status(500).send("حدث خطأ أثناء حذف طلب.");
      }
        res.redirect('/showOrders'); 
    });
  };

  const showOrdersForBroker = (req, res) => {
  const brokerName = req.body.name;

  const query = `
    SELECT 
      orders.id, 
      users.username, 
      orders.total_price, 
      orders.payment_method, 
      orders.status, 
      orders.created_at,
      orders.location,
      brokers.name AS broker_name
    FROM orders
    INNER JOIN users ON orders.user_id = users.id
    LEFT JOIN brokers ON orders.broker_id = brokers.id
    WHERE brokers.name = ?
    ORDER BY orders.created_at DESC
  `;

  pool.query(query, [brokerName], (err, results) => {
    if (err) {
      console.error('خطأ أثناء جلب الطلبات:', err);
      return res.status(500).send('حدث خطأ في السيرفر');
    }
    res.render('showorderbroker', { orders: results , brokerName});
  });
};

module.exports = { showOrders , searchOrderItems , updateOrderStatus , deleteOrder , showOrdersForBroker};  