const { pool } = require("../utils/db");

const add_rait = async (req, res) => {
    const { broker_id, rating, comint } = req.body;

    console.log("broker ", broker_id);

    if (!broker_id || !rating) {
        return res.status(400).json({ error: "يجب إدخال ID للبروكر وتقييم!" });
    }

    try {
        const query = "SELECT * FROM brokers";
        const user_id = req.session.userId; // الحصول على ID المستخدم من الجلسة
        console.log("user ", user_id);
        
        // تحقق مما إذا كان المستخدم قد قام بتقييم الوسيط  
        const [existingReview] = await pool.promise().query(
            "SELECT * FROM reviews WHERE user_id = ? AND broker_id = ?",
            [user_id, broker_id]
        );

        // إذا كان هناك تقييم سابق، ارجع برسالة خطأ
        if (existingReview.length > 0) {
            const [rows] = await pool.promise().query(query);
            return res.status(400).render("Brokers", { brokers: rows, message: "لا يمكنك تقييم هذا الوسيط مرة أخرى" });
        }

        // إضافة التقييم إلى قاعدة البيانات
        await pool.promise().query(
            "INSERT INTO reviews (user_id, broker_id, rating, review) VALUES (?, ?, ?, ?)",
            [user_id, broker_id, rating, comint]
        );

        console.log("Review added successfully");

        // حساب عدد التقييمات ومتوسط التقييمات لهذا الوسيط
        const [ratingStats] = await pool.promise().query(
            "SELECT COUNT(rating) AS total_reviews, AVG(rating) AS average_rating FROM reviews WHERE broker_id = ?",
             [broker_id]
        );

        const totalReviews = ratingStats[0].total_reviews;
        const averageRating = ratingStats[0].average_rating;

        // تحديث العمود Rating في جدول brokers
        await pool.promise().query(
            "UPDATE brokers SET Rating = ? WHERE id = ?",
            [averageRating, broker_id]
        );

        // طباعة عدد التقييمات ومتوسط التقييمات في الكونسول
        console.log(`number of ratingID ${broker_id}: ${totalReviews}`);
        console.log(`averg rating ID ${broker_id}: ${averageRating}`);

        // جلب قائمة الوسطاء بعد إضافة التقييم
        const [rows] = await pool.promise().query(query);
        res.status(201).render("Brokers", { brokers: rows, message: "تم إضافة تقييمك" });
        
    } catch (err) {
        console.error("Error submitting review:", err);
        res.status(500).json({ error: "حدث خطأ أثناء إضافة التقييم" });
    }
};

const viwecommint = (req, res, next) => {
    res.render("Technicalsupport", { title: "=>Technical" });
    res.end();
  };

module.exports = { add_rait,viwecommint};