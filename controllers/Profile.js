const { pool } = require("../utils/db");
const multer = require("multer");
const upload = multer({ dest: "public/uploads/" });

const uploadImage = (req, res, next) => {
  if (!req.file) {
    return res.status(400).render("405", { message: "لم يتم رفع الصورة." });
  }

  const imageUrl = `/uploads/${req.file.filename}`; // رابط الصورة بعد رفعها

  if (!req.session.userId) {
    return res
      .status(401)
      .render("405", { message: "يجب أن تكون مسجلاً للدخول!" });
  }

  // استرجاع الـ role من الجلسة
  const userRole = req.session.role;

  // التحقق من الدور وتحديد الجدول الذي سيتم تخزين الصورة فيه
  if (userRole === "broker") {
    // إذا كان الدور broker، سيتم تخزين الصورة في جدول brokers
    pool.query(
      "UPDATE brokers SET image = ? WHERE id = ?",
      [imageUrl, req.session.userId], // استخدام الـ userId من الجلسة
      (err, result) => {
        if (err) {
          console.error("❌Error storing image in brokers table:", err);
          return res
            .status(500)
            .render("405", {
              message: "حدث خطأ في تخزين الصورة في جدول brokers.",
            });
        }
        console.log(
          "The image has been successfully uploaded to the brokers table!"
        );
      }
    );
  } else {
    // إذا لم يكن الدور broker، سيتم تخزين الصورة في جدول users
    pool.query(
      "UPDATE users SET profile_picture = ? WHERE id = ?",
      [imageUrl, req.session.userId], // تحديث الصورة للمستخدم
      (err, result) => {
        if (err) {
          console.error("Error storing image in users table:", err);
          return res
            .status(500)
            .render("405", {
              message: "حدث خطأ في تخزين الصورة في جدول users.",
            });
        }
        console.log(
          "The image has been successfully uploaded to the users table!"
        );
      }
    );
  }
};

const updateBroker = async (req, res, next) => {
  const { name, email, phone, facebook, instagram, website, details } =
    req.body;
  const id = req.session.userId; // الحصول على الـ id من الجلسة
  let errors = {};

  console.log(id);

  if (!id) {
    errors.general = "لم يتم العثور على المستخدم في الجلسة";
    return res.render("404", { errors, message: null });
  }

  try {
    const [existingBroker] = await pool
      .promise()
      .query("SELECT * FROM brokers WHERE (name = ? OR emil = ?) AND id != ?", [
        name,
        email,
        id,
      ]);

    if (existingBroker.length > 0) {
      errors.existingData =
        "الاسم أو البريد الإلكتروني مكرران. يرجى إدخال بيانات مختلفة.";
    }

    if (Object.keys(errors).length > 0) {
      return res.render("404", {
        errors,
        name,
        email,
        phone,
        facebook,
        instagram,
        website,
        details,
        message: null,
      });
    }

    // تحديث البيانات في قاعدة البيانات
    const [result] = await pool
      .promise()
      .query(
        "UPDATE brokers SET name = ?, emil = ?, phone = ?, Facebook_account = ?, Instagram_account = ?, website = ?, details = ? WHERE id = ?",
        [name, email, phone, facebook, instagram, website, details, id]
      );

    if (result.affectedRows === 0) {
      return res.render("404", {
        errors: { general: "لم يتم العثور على الوسيط" },
        message: null,
      });
    }

    //جلب بيانات
    const [brokerData] = await pool.promise().query("SELECT * FROM brokers WHERE id = ?", [id]);

    if (brokerData.length === 0) {
      return res.render("404", {
        errors: { general: "حدث خطأ أثناء جلب بيانات الوسيط" },
        message: null,
      });
    }

    res.render("Profilebroker", { broker: brokerData[0] });
    console.log("updet suqses");
  } catch (err) {
    console.error("Error during update:", err);
    res.render("404", {
      errors: { general: "حدث خطأ أثناء التحديث" },
      message: null,
    });
  }
};

module.exports = { upload, uploadImage, updateBroker };
