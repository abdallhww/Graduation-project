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
  
      res.redirect("/showmassge"); // ارجع لصفحة الرسائل بعد التحديث
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

module.exports = { showmassge,updateStatus,getSupportStats,goadminhome};