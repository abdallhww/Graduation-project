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

    results.forEach(item => {
        item.creatdat = new Date(item.creatdat).toLocaleDateString();
      });

    res.render('selestoday', { sales: results ,totalSales: results.length });
  });
};

const salesweek = (req, res) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7); // بداية الأسبوع الماضي

    const formattedStart = startDate.toISOString().slice(0, 10);
    const formattedEnd = endDate.toISOString().slice(0, 10);

    const salesQuery = `
      SELECT p.name AS product_name, p.price, o.quantity, o.creatdat
      FROM order_items o
      JOIN products p ON o.product_id = p.id
      WHERE DATE(o.creatdat) BETWEEN ? AND ?
    `;

    pool.query(salesQuery, [formattedStart, formattedEnd], (err, results) => {
      if (err) {
        console.error('خطأ أثناء جلب المبيعات الأسبوعية:', err);
        return res.status(500).send('حدث خطأ أثناء عرض مبيعات الأسبوع');
      }

      // تحويل creatdat إلى كائن تاريخ صالح
      results.forEach(item => {
        item.creatdat = new Date(item.creatdat).toLocaleDateString(); // تحويل creatdat إلى تنسيق تاريخ مناسب
      });

      res.render('salesweek', {
        sales: results,
        startDate: formattedStart,
        endDate: formattedEnd,
        totalSales: results.length
      });
    });
};


const salesmonth = (req, res) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 1); // بداية الشهر الماضي

    const formattedStart = startDate.toISOString().slice(0, 10);
    const formattedEnd = endDate.toISOString().slice(0, 10);

    const salesQuery = `
      SELECT p.name AS product_name, p.price, o.quantity, o.creatdat
      FROM order_items o
      JOIN products p ON o.product_id = p.id
      WHERE DATE(o.creatdat) BETWEEN ? AND ?
    `;

    pool.query(salesQuery, [formattedStart, formattedEnd], (err, results) => {
      if (err) {
        console.error('خطأ أثناء جلب مبيعات الشهر:', err);
        return res.status(500).send('حدث خطأ أثناء عرض مبيعات الشهر');
      }

      // تحويل last_date إلى تنسيق تاريخ مناسب
      results.forEach(item => {
        item.creatdat = new Date(item.creatdat).toLocaleDateString();
      });

      // إرسال النتائج للعرض مع عدد المنتجات
      res.render('salesmonth', {
        sales: results,
        startDate: formattedStart,
        endDate: formattedEnd,
        totalSales: results.length // عرض عدد المنتجات المباعة
      });
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

      // إرسال النتائج للعرض مع عدد المنتجات المباعة
      res.render('salesalltime', {
        sales: results,
        totalSales: results.length // عرض عدد المنتجات المباعة
      });
    });
};


module.exports = { salestoday , salesweek , salesmonth , salestotal };