const { pool } = require("../utils/db");

const salestoday = (req, res) => {
  const salesQuery = `
    SELECT 
      o.product_name, 
      o.product_price, 
      o.quantity, 
      o.creatdat 
    FROM order_items o
    WHERE DATE(o.creatdat) = CURDATE()
  `;

  pool.query(salesQuery, (err, results) => {
    if (err) {
      console.error('خطأ أثناء جلب المبيعات:', err);
      return res.status(500).send('حدث خطأ أثناء عرض المبيعات');
    }

    const totalAmount = results.reduce((total, item) => total + (item.product_price * item.quantity), 0);

    results.forEach(item => {
        item.creatdat = new Date(item.creatdat).toLocaleDateString();
      });

    res.render('selestoday', { sales: results ,totalSales: results.length ,totalAmount});
  });
};

const salestotal = (req, res) => {
    const salesQuery = `
      SELECT o.product_name, o.product_price, o.quantity, o.creatdat
      FROM order_items o
    `;

    pool.query(salesQuery, (err, results) => {
        if (err) {
            console.error('خطأ أثناء جلب جميع المبيعات:', err);
            return res.status(500).send('حدث خطأ أثناء عرض إجمالي المبيعات');
        }

        results.forEach(item => {
            item.creatdat = new Date(item.creatdat).toLocaleDateString();
        });

        const totalAmount = results.reduce((total, item) => total + (item.product_price * item.quantity), 0);

        res.render('salesalltime', {
            sales: results,
            totalSales: results.length,
            totalAmount
        });
    });
};

const filterSales = (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.send('يرجى تحديد تاريخ البداية والنهاية');
  }

  const salesQuery = `
    SELECT o.product_name, o.product_price, o.quantity, o.creatdat
    FROM order_items o
    WHERE DATE(o.creatdat) BETWEEN ? AND ?
  `;

  pool.query(salesQuery, [from, to], (err, results) => {
    if (err) {
      console.error('خطأ أثناء تصفية المبيعات حسب التاريخ:', err);
      return res.status(500).send('حدث خطأ أثناء تصفية المبيعات');
    }

    // تنسيق التاريخ للعرض
    results.forEach(item => {
      item.creatdat = new Date(item.creatdat).toLocaleDateString();
    });

    const totalSales = results.reduce((total, item) => total + item.quantity, 0);
    const totalAmount = results.reduce((total, item) => total + (item.product_price * item.quantity), 0);

    res.render('salesalltime', {
      sales: results,
      totalSales,
      totalAmount
    });
  });
};

const filterSales2 = (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.send('يرجى تحديد تاريخ البداية والنهاية');
  }

  const salesQuery = `
    SELECT o.product_name, o.product_price, o.quantity, o.creatdat
    FROM order_items o
    WHERE DATE(o.creatdat) BETWEEN ? AND ?
  `;

  pool.query(salesQuery, [from, to], (err, results) => {
    if (err) {
      console.error('خطأ أثناء تصفية المبيعات حسب التاريخ:', err);
      return res.status(500).send('حدث خطأ أثناء تصفية المبيعات');
    }

    // تنسيق التاريخ للعرض
    results.forEach(item => {
      item.creatdat = new Date(item.creatdat).toLocaleDateString();
    });

    const totalSales = results.reduce((total, item) => total + item.quantity, 0);
    const totalAmount = results.reduce((total, item) => total + (item.product_price * item.quantity), 0);

    res.render('salesalltimee', {
      sales: results,
      totalSales,
      totalAmount
    });
  });
};

const getSalesData = (req, res) => {
  // الاستعلام للحصول على مبيعات حسب التاريخ ( لمبيعات الشهر)
  const query = `
  SELECT DATE(oi.creatdat) AS date, SUM(oi.quantity * p.price) AS sales
  FROM order_items oi
  JOIN products p ON oi.product_id = p.id
  WHERE oi.creatdat BETWEEN '2023-01-01' AND '2023-01-31'
  GROUP BY DATE(oi.creatdat)
`;

  pool.query(query, (err, results) => {
    if (err) {
      console.log('Error fetching sales data:', err);
      return res.status(500).send('Error fetching data');
    }

    // تحضير البيانات لعرضها في الرسم البياني
    const salesData = {
      labels: results.map(row => row.date), // تواريخ المبيعات
      values: results.map(row => row.sales) // قيم المبيعات
    };

    // إرسال البيانات إلى الصفحة
    console.log(salesData);
    res.render('saleschart', { salesData });
  });
};

const selectBroker = (req, res) => {
    const brokerId = req.params.brokerId;
    const userId = req.session.userId;

    // جلب آخر طلب للمستخدم
    pool.query(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
        [userId],
        (err, orders) => {
            if (err) {
                console.error('Error fetching orders:', err);
                return res.status(500).send('حدث خطأ أثناء جلب الطلبات');
            }

            if (!orders || orders.length === 0) {
                return res.status(404).send('لا يوجد طلب لهذا المستخدم');
            }

            const orderId = orders[0].id;

            // تحديث الطلب بإضافة الوسيط
            pool.query(
                'UPDATE orders SET broker_id = ? WHERE id = ?',
                [brokerId, orderId],
                (err, result) => {
                    if (err) {
                        console.error('Error updating order:', err);
                        return res.status(500).send('حدث خطأ أثناء تحديث الطلب');
                    }

                    // جلب بيانات الطلب وبيانات الوسيط لعرضها في الصفحة
                    pool.query(
                        `SELECT orders.id AS orderId, orders.total_price,orders.location, brokers.name AS brokerName 
                         FROM orders 
                         JOIN brokers ON orders.broker_id = brokers.id 
                         WHERE orders.id = ?`,
                        [orderId],
                        (err, result) => {
                            if (err) {
                                console.error('Error fetching order and broker info:', err);
                                return res.status(500).send('حدث خطأ أثناء جلب بيانات الوسيط والطلب');
                            }

                            if (result.length === 0) {
                                return res.status(404).send('لم يتم العثور على بيانات الوسيط أو الطلب');
                            }

                            const orderInfo = result[0];

                            // عرض صفحة الدفع مع البيانات
                            res.render('payment2', {
                                brokerName: orderInfo.brokerName,
                                orderId: orderInfo.orderId,
                                totalPrice: orderInfo.total_price,
                                orderLocation: orderInfo.location,
                                brokerId,
                            });
                        }
                    );
                }
            );
        }
    );
};

const salestotalw = (req, res) => {
   const userId = req.session.userId;

  if (!userId) {
    return res.status(403).send('غير مصرح لك بالوصول إلى هذه الصفحة');
  }

  const salesQuery = `
    SELECT 
      o.product_name, 
      o.product_price,
      o.quantity, 
      o.creatdat
    FROM order_items o
    JOIN products p ON o.product_id = p.id
    WHERE p.seler_id = ?
  `;

  pool.query(salesQuery, [userId], (err, results) => {
    if (err) {
      console.error('خطأ أثناء جلب مبيعات التاجر:', err);
      return res.status(500).send('حدث خطأ أثناء عرض إجمالي المبيعات');
    }

    // تحويل creatdat إلى تنسيق تاريخ مناسب
    results.forEach(item => {
      item.creatdat = new Date(item.creatdat).toLocaleDateString();
    });

    const totalAmount = results.reduce((total, item) => total + (item.product_price * item.quantity), 0);

    res.render('salesalltimee', {
      sales: results,
      totalSales: results.length,
      totalAmount
    });
  });
};

module.exports = { salestoday , salestotal , filterSales , getSalesData , selectBroker , salestotalw , filterSales2};