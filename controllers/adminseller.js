const { pool } = require("../utils/db");

const calculateSalesReport = (req, res) => {
  const { merchantName, startDate, endDate } = req.query;

  if (!merchantName || !startDate || !endDate) {
    return res.status(400).send("الرجاء تعبئة جميع الحقول.");
  }

  pool.query('SELECT id FROM users WHERE username = ?', [merchantName], (err, merchantResult) => {
    if (err) return res.status(500).send("خطأ في البحث عن التاجر.");
    if (merchantResult.length === 0) {
      return res.send(`<h2>لم يتم العثور على تاجر بهذا الاسم.</h2><a href="/showMerchants">الرجوع</a>`);
    }

    const merchantId = merchantResult[0].id;

    // جلب المنتجات المباعة ضمن الفترة الزمنية
    const sql = `
      SELECT 
        oi.product_name,
        oi.quantity,
        p.price,
        (oi.quantity * p.price) AS total_price,
        oi.creatdat
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE p.seler_id = ? AND oi.creatdat BETWEEN ? AND ?
    `;

    pool.query(sql, [merchantId, startDate, endDate], (err2, productsResult) => {
      if (err2) return res.status(500).send("حدث خطأ أثناء جلب المنتجات.");

      let totalSales = 0;
      productsResult.forEach(p => {
        totalSales += Number(p.total_price) || 0;
      });

      const defaultPercentage = 10; // 10%

      res.render('salesReportForm', {
        merchantName,
        products: productsResult,
        totalSales: totalSales.toFixed(2),
        startDate,
        endDate,
        storePercentage: defaultPercentage,
        storeShare: (totalSales * (defaultPercentage / 100)).toFixed(2),
        merchantId
      });
    });
  });
}; 

const saveSalesReport = (req, res) => {
  const { merchantId, startDate, endDate, totalSales, storePercentage, adminComment } = req.body;

  if (!merchantId || !startDate || !endDate || !totalSales || !storePercentage) {
    return res.status(400).send("الرجاء تعبئة جميع الحقول المطلوبة.");
  }

  const storeShare = (Number(totalSales) * (Number(storePercentage) / 100)).toFixed(2);

  const insertSql = `
    INSERT INTO sales_reports 
    (merchant_id, start_date, end_date, total_sales, store_percentage, store_share, admin_comment) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  pool.query(insertSql, [merchantId, startDate, endDate, totalSales, storePercentage, storeShare, adminComment], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("حدث خطأ أثناء حفظ التقرير.");
    }
  res.render('screport');
  });
};

const viewSalesReports = (req, res) => {
  const getReportsSql = `
    SELECT sr.*, u.username AS merchant_name
    FROM sales_reports sr
    JOIN users u ON sr.merchant_id = u.id
    ORDER BY sr.recorded_at DESC
  `;

  const getTotalPaidShareSql = `
    SELECT SUM(store_share) AS total_paid_share
    FROM sales_reports
    WHERE payment_status = 'مدفوع'
  `;

  pool.query(getReportsSql, (err, reports) => {
    if (err) {
      console.error('خطأ أثناء جلب التقارير:', err);
      return res.status(500).send("حدث خطأ أثناء جلب التقارير.");
    }

    pool.query(getTotalPaidShareSql, (err, totalResult) => {
      if (err) {
        console.error('خطأ أثناء حساب إجمالي حصة المدفوعة:', err);
        return res.status(500).send("حدث خطأ أثناء حساب الحصص.");
      }

      const totalPaidShare = totalResult[0].total_paid_share || 0;

      res.render("salesReports", {
        reports: reports,
        totalPaidShare: totalPaidShare
      });
    });
  });
};

const updatePaymentStatus = (req, res) => {
  const { report_id } = req.body;

  const sql = `
    UPDATE sales_reports
    SET payment_status = 'مدفوع'
    WHERE id = ?
  `;

  pool.query(sql, [report_id], (err, result) => {
    if (err) {
      console.error('خطأ في تحديث حالة الدفع:', err);
      return res.status(500).send("فشل التحديث.");
    }

    res.redirect('/salesReports');
  });
};

const deleteReport = (req, res) => {
  const { report_id } = req.body;

  const sql = 'DELETE FROM sales_reports WHERE id = ?';
  pool.query(sql, [report_id], (err, result) => {
    if (err) {
      console.error('خطأ في حذف التقرير:', err);
      return res.status(500).send("فشل الحذف.");
    }

    res.redirect('/salesReports');
  });
};

module.exports = { calculateSalesReport , saveSalesReport , viewSalesReports , updatePaymentStatus , deleteReport };  