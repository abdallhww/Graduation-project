const { pool } = require("../utils/db");

const salestoday = (req, res) => {
  const salesQuery = `
    SELECT p.name AS product_name, p.price, o.quantity, o.creatdat 
    FROM order_items o
    JOIN products p ON o.product_id = p.id
    WHERE DATE(o.creatdat) = CURDATE()
  `;

  pool.query(salesQuery, (err, results) => {
    if (err) {
      console.error('خطأ أثناء جلب المبيعات:', err);
      return res.status(500).send('حدث خطأ أثناء عرض المبيعات');
    }

    const totalAmount = results.reduce((total, item) => total + (item.price * item.quantity), 0);

    results.forEach(item => {
        item.creatdat = new Date(item.creatdat).toLocaleDateString();
      });

    res.render('selestoday', { sales: results ,totalSales: results.length ,totalAmount});
  });
};

const salestotal = (req, res) => {
    const salesQuery = `
      SELECT p.name AS product_name, p.price, o.quantity, o.creatdat
      FROM order_items o
      JOIN products p ON o.product_id = p.id
    `;

    pool.query(salesQuery, (err, results) => {
      if (err) {
        console.error('خطأ أثناء جلب جميع المبيعات:', err);
        return res.status(500).send('حدث خطأ أثناء عرض إجمالي المبيعات');
      }

      // تحويل creatdat إلى تنسيق تاريخ مناسب
      results.forEach(item => {
        item.creatdat = new Date(item.creatdat).toLocaleDateString();
      });

      const totalAmount = results.reduce((total, item) => total + (item.price * item.quantity), 0);

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
    SELECT p.name AS product_name, p.price, o.quantity, o.creatdat
    FROM order_items o
    JOIN products p ON o.product_id = p.id
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
    const totalAmount = results.reduce((total, item) => total + (item.price * item.quantity), 0);

    res.render('salesalltime', {
      sales: results,
      totalSales,
      totalAmount
    });
  });
};

const getSalesData = (req, res) => {
  // الاستعلام للحصول على مبيعات حسب التاريخ (مثال لمبيعات الشهر)
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

module.exports = { salestoday , salestotal , filterSales , getSalesData};