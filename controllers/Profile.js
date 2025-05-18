const { pool } = require("../utils/db");
const multer = require("multer");
const upload = multer({ dest: "public/uploads/" });

const home = (req, res, next) => {

  if(req.session.role=="seller"||req.session.role=="broker")
    {
  res.render("home2");
  res.end();
    }
else 
{
  res.render("home");
  res.end();
}
};

const logout =(req,res,next) =>{
  res.render("users", {messags:null, messag:"نتمنى انا تجربتك لل موقع كانت جيده" });
  res.end;
}

const homes=(req,res,next)=>{
  res.render("home");
}

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

  const userRole = req.session.role;

  if (userRole === "broker") {
   
    pool.query(
      "UPDATE brokers SET image = ? WHERE id = ?",
      [imageUrl, req.session.userId],
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
    pool.query(
      "UPDATE users SET profile_picture = ? WHERE id = ?",
      [imageUrl, req.session.userId],
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
  const id = req.session.userId; 
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
const updateusers = async (req, res, next) => {
  const { username, email, phone, password } = req.body;
  const id = req.session.userId;
  const userrole = req.session.role;
  let errors = {};

  // التحقق من وجود المستخدم في الجلسة
  if (!id) {
    errors.general = "لم يتم العثور على المستخدم في الجلسة";
    return res.render("404", { errors, message: null });
  }

  // التحقق من صحة المدخلات
  if (!username || username.length < 3) {
    errors.username = "اسم المستخدم يجب أن يكون 3 أحرف على الأقل.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = "البريد الإلكتروني غير صالح. تأكد أن يكون على الشكل التالي مثل: user@example.com أو ahmed123@gmail.com أو test@domain.org";
  }

  const phoneRegex = /^[0-9]{10}$/;
  if (!phone || !phoneRegex.test(phone)) {
    errors.phone = "رقم الهاتف يجب أن يحتوي على 10 أرقام فقط.";
  }

  if (!password || password.length < 6) {
    errors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل.";
  }

  if (Object.keys(errors).length > 0) {
    return res.render("404", {
      errors,
      username,
      email,
      phone,
      message: null,
    });
  }

  try {
    // التحقق من التكرار
    const [existingUser] = await pool
      .promise()
      .query(
        "SELECT * FROM users WHERE (username = ? OR email = ?) AND id != ?",
        [username, email, id]
      );

    if (existingUser.length > 0) {
      errors.existingData = "اسم المستخدم أو البريد الإلكتروني مكرر. يرجى إدخال بيانات مختلفة.";
      return res.render("404", {
        errors,
        username,
        email,
        phone,
        message: null,
      });
    }

    // تحديث البيانات
    const [result] = await pool
      .promise()
      .query(
        "UPDATE users SET username = ?, email = ?, phone = ?, password = ? WHERE id = ?",
        [username, email, phone, password, id]
      );

    if (result.affectedRows === 0) {
      return res.render("404", {
        errors: { general: "لم يتم العثور على المستخدم" },
        message: null,
      });
    }

    // جلب البيانات بعد التحديث
    const [userDataRows] = await pool
      .promise()
      .query("SELECT * FROM users WHERE id = ?", [id]);

    if (!userDataRows || userDataRows.length === 0) {
      return res.render("404", {
        errors: { general: "حدث خطأ أثناء جلب بيانات المستخدم" },
        message: null,
      });
    }

    const userData = userDataRows[0];

    // عرض الصفحة المناسبة حسب نوع المستخدم
    if (userrole === "seller") {
      res.render("Profileselers", {
        user: userData,
        message: "تم التحديث بنجاح",
      });
    } else {
      res.render("Profile", {
        user: userData,
        message: "تم التحديث بنجاح",
      });
    }

    console.log("تم التحديث بنجاح");
  } catch (err) {
    console.error("Error during update:", err);
    res.render("404", {
      errors: { general: "حدث خطأ أثناء التحديث" },
      message: null,
    });
  }
};


const showUserMessages = (req, res, next) => {
  const userId = req.session.userId;

  const query = `
    SELECT message, status, created_at ,reply
    FROM support_messages 
    WHERE user_id = ? 
    ORDER BY created_at DESC
  `;

  pool.query(query, [userId], (err, rows) => {
    if (err) return next(err);

    res.render("userMessages", {
      userMessages: rows,
    });
  });
};


module.exports = { upload , uploadImage , home , updateBroker , updateusers , homes , logout , showUserMessages };