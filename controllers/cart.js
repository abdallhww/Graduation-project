const { pool } = require("../utils/db");

  const get_user = (req, res, next) => {
    if (req.session.userId) {
        console.log("from get_user "+req.session.userId); // طباعة userId في السجل
        return res.json({ userId: req.session.userId }); // إضافة return لإيقاف التنفيذ بعد الإرسال
    } else {
        return res.status(401).json({ error: "لم يتم تسجيل الدخول" }); // إضافة return
    }
};

module.exports = { get_user};  