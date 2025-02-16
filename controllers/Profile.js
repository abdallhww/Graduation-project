const { pool } = require("../utils/db");
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });

const uploadImage = (req, res, next) => {
    if (!req.file) {
      return res.status(400).render("405",{message:"لم يتم رفع الصورة."});
    }
  
    const imageUrl = `/uploads/${req.file.filename}`;  // رابط الصورة بعد رفعها
  
    if (!req.session.userId) {
      return res.status(401).render("405", {message:"يجب أن تكون مسجلاً للدخول!"});
    }
  
    // استرجاع الـ role من الجلسة
    const userRole = req.session.role;
  
    // التحقق من الدور وتحديد الجدول الذي سيتم تخزين الصورة فيه
    if (userRole === 'broker') {
      // إذا كان الدور broker، سيتم تخزين الصورة في جدول brokers
      pool.query(
        'INSERT INTO brokers (id, image) VALUES (?, ?)',
        [req.session.userId, imageUrl],  // استخدام الـ userId من الجلسة
        (err, result) => {
          if (err) {
            console.error('Error storing image in brokers table:', err);
            return res.status(500).render("405", {message:"حدث خطأ في تخزين الصورة في جدول brokers."});
          }
          console.log('The image has been successfully uploaded to the brokers table!');
        }
      );
    } else {
      // إذا لم يكن الدور broker، سيتم تخزين الصورة في جدول users
      pool.query(
        'UPDATE users SET profile_picture = ? WHERE id = ?',
        [imageUrl, req.session.userId],  // تحديث الصورة للمستخدم
        (err, result) => {
          if (err) {
            console.error('Error storing image in users table:', err);
            return res.status(500).render("405", {message:"حدث خطأ في تخزين الصورة في جدول users."});
          }
         console.log('The image has been successfully uploaded to the users table!');
        }
      );
    }
  };
  module.exports = { upload, uploadImage};