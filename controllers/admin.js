const { pool } = require("../utils/db");

const goadminhome = (req, res, next) => {
    res.render("admin", { title: "=>Technical" });
    res.end();
  };

  const showmassge = (req, res, next) => {
    const query = "SELECT * FROM support_messages ORDER BY created_at DESC";
    pool.query(query, (err, rows) => {
      if (err) return next(err);
      res.render("showmassge", { showmassge: rows,message:null });
    });
  };

  const updateStatus = (req, res) => {
    const { id, status } = req.body;
  
    const sql = "UPDATE support_messages SET status = ? WHERE id = ?";
    pool.query(sql, [status, id], (err, result) => {
      if (err) {
        console.error("خطأ في تحديث الحالة:", err);
        return res.status(500).send("حدث خطأ أثناء التحديث");
      }
  
      res.redirect("/showmassge"); // رجوع لصفحة الرسائل بعد التحديث
    });
  };

  const getSupportStats = (req, res) => {
    const sql = `
      SELECT 
        status, 
        COUNT(*) as count 
      FROM support_messages 
      GROUP BY status
    `;
  
    pool.query(sql, (err, results) => {
      if (err) {
        console.error("خطأ في جلب الإحصائيات:", err);
        return res.status(500).send("حدث خطأ في جلب البيانات");
      }
  
      // تحويل النتائج إلى كائن
      const stats = {
        "بانتظار الرد": 0,
        "تم الرد": 0,
        "مغلق": 0
      };
  
      results.forEach(row => {
        stats[row.status] = row.count;
      });
  
      res.render("supportStats", { stats });
    });
  };

  const deleteMessage = (req, res) => {
    const { id } = req.body;
  
    const sql = "DELETE FROM support_messages WHERE id = ?";
    pool.query(sql, [id], (err, result) => {
      if (err) {
        console.error("فشل في حذف الرسالة:", err);
        return res.status(500).send("حدث خطأ أثناء حذف الرسالة.");
      }
      res.redirect('/showmassge');
    });
  };

  const deletBroker = (req, res) => {
    const { id } = req.body;

    const sql = "DELETE FROM brokers WHERE id = ?";
    pool.query(sql,[id],(err,result) => {
        if(err) {
            console.error("فشل في حذف المندوب:", err);
            return res.status(500).send("حدث خطأ أثناء حذف المندوب.");
        }
        res.redirect('/viweBrokers');
        
    });
};


  const viweBrokers = (req, res, next) => {
    const query = "SELECT * FROM brokers";
    pool.query(query, (err, rows) => {
      if (err) return next(err);
      res.render("adminbroker", { brokers: rows,message:null });
    });
  };

  const searchBroker = (req, res) => {
    const { name } = req.query;

    const sql = "SELECT * FROM brokers WHERE name LIKE ?";
    const searchValue = `%${name}%`; // للبحث 

    pool.query(sql, [searchValue], (err, results) => {
        if (err) {
            console.error("خطأ في البحث عن الوسيط:", err);
            return res.status(500).send("حدث خطأ أثناء البحث.");
        }
        res.render("adminbroker", { brokers: results });
    });
};

const showmassf = (req, res, next) => {
  const id = req.session.userId;

  const query = "SELECT * FROM support_messages WHERE user_id = ? ORDER BY created_at DESC";
  pool.query(query, [id], (err, rows) => {
    if (err) return next(err);
    res.render("showmassf", { showmassf: rows, message: null });
  });
};

const replyMessage = async (req, res) => {
  const { id, reply } = req.body;
  try {
     pool.query('UPDATE support_messages SET reply = ? WHERE id = ?', [reply, id]);
    res.redirect('back');
  } catch (err) {
    console.error('خطأ أثناء تحديث الرد:', err);
    res.status(500).send('حدث خطأ أثناء تحديث الرد');
  }
};

const searchMerchantProducts = (req, res) => {
  const merchantName = req.query.merchantName;

  pool.query('SELECT id FROM users WHERE username = ?', [merchantName], (err, merchantResult) => {
    if (err) {
      console.error(err);
      return res.status(500).send("حدث خطأ في البحث عن التاجر.");
    }

    if (merchantResult.length === 0) {
      return res.send(`<h2>لم يتم العثور على تاجر بهذا الاسم.</h2><a href="/showMerchants">الرجوع</a>`);
    }

    const merchantId = merchantResult[0].id;

    const sql = `
      SELECT 
        oi.product_name, 
        oi.quantity, 
        oi.creatdat,
        oi.product_price,
        (oi.quantity * oi.product_price) AS total_price
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE p.seler_id = ?
    `;

    pool.query(sql, [merchantId], (err2, productsResult) => {
      if (err2) {
        console.error(err2);
        return res.status(500).send("حدث خطأ أثناء جلب المنتجات.");
      }

      let totalSales = 0;
      productsResult.forEach(p => {
        totalSales += Number(p.total_price) || 0;
      });

      const storePercentage = 0.10;
      const storeShare = totalSales * storePercentage;

      res.render('merchantProducts', {
        merchantName: merchantName,
        products: productsResult,
        totalSales: totalSales.toFixed(2),
        storeShare: storeShare.toFixed(2)
      });
    });
  });
};

module.exports = { showmassge , updateStatus , getSupportStats ,goadminhome , deleteMessage ,
    viweBrokers , deletBroker , searchBroker , showmassf , replyMessage , searchMerchantProducts };