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
  const { username, email, phone,password} = req.body;
  const id = req.session.userId;
  const userrole=req.session.role;
  let errors = {};

  console.log(id);
 console.log(username);
  if (!id) {
    errors.general = "لم يتم العثور على المستخدم في الجلسة";
    return res.render("404", { errors, message: null });
  }

  try {
    // التحقق من تكرار
    const [existingUser] = await pool
      .promise()
      .query("SELECT * FROM users WHERE (username = ? OR email = ?) AND id != ?", [
        username,
        email,
        id,
      ]);

    if (existingUser.length > 0) {
      errors.existingData = "اسم المستخدم أو البريد الإلكتروني مكرر. يرجى إدخال بيانات مختلفة.";
    }

    if (Object.keys(errors).length > 0) {
      return res.render("404", {
        errors,
        username,
        email,
        phone,
        profile_picture,
        message: null,
      });
    }

    //تحديث البيانات 
    const [result] = await pool
      .promise()
      .query(
        "UPDATE users SET username = ?, email = ?, phone = ?,password=? WHERE id = ?",
        [username, email, phone,password, id]
      );

    if (result.affectedRows === 0) {
      return res.render("404", {
        errors: { general: "لم يتم العثور على المستخدم" },
        message: null,
      });
    }

    // جلب بيانات
    const [userData] = await pool.promise().query("SELECT * FROM users WHERE id = ?", [id]);

    if (userData.length === 0) {
      return res.render("404", {
        errors: { general: "حدث خطأ أثناء جلب بيانات المستخدم" },
        message: null,
      });
    }
   if(userrole=="seller"){
    res.render("Profileselers", { user: userData[0],message: "updet suqses" });
    console.log("updet suqses");
   }
   else{
    res.render("Profile", { user: userData[0] });
    console.log("updet suqses");}
  } catch (err) {
    console.error("Error during update:", err);
    res.render("404", {
      errors: { general: "حدث خطأ أثناء التحديث" },
      message: null,
    });
  }
};

module.exports = { upload , uploadImage , home , updateBroker , updateusers , homes ,logout};