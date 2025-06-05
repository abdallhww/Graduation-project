const { pool } = require("../utils/db");
const bcrypt = require('bcrypt');

const login = async (req, res, next) => {
  const { username, password } = req.body;
  let errors = {};

  if (!username || !password) {
    errors.general = "اسم المستخدم وكلمة السر مطلوبان";
    return res.render("404", { errors ,message:null});
  }

  try {
    let tableName = "users";

    let [existingUser] = await pool.promise().query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, username]
    );

    if (existingUser.length === 0) {
      [existingUser] = await pool.promise().query(
        "SELECT * FROM brokers WHERE name = ? OR emil = ?",
        [username, username]
      );
      tableName = "broker";
    }

    if (existingUser.length === 0) {
      errors.general = "اسم المستخدم أو البريد الإلكتروني غير موجود";
      return res.render("404", { errors ,message:null});
    }

    const isPasswordValid = existingUser[0].password === password; // يمكن استخدام bcrypt  لتشفير ومقارنة كلمة السر
    if (!isPasswordValid) {
      errors.general = "كلمة السر غير صحيحة";
      return res.render("404", { errors ,message:null});
    }

    req.session.role = existingUser[0].role;
    req.session.userId = existingUser[0].id;
    console.log(`User logged in from ${tableName}, session userId:`, req.session.userId);
    
    const role = existingUser[0].role;
    console.log(role);

    if(role=='seller'||role=='broker')
    res.render("home2", {message:null , role ,username});
  else if(role=='buyer')
    res.render("index", {message:null });
  else if(role=='admin')
  res.render("admin", {message:null });

  } catch (err) {
    console.error("Error during login:", err);
    res.render("404", { errors: { general: "حدث خطأ أثناء تسجيل الدخول" } });
  } 
};


const registration = async (req, res, next) => {
  const { regusername, regemail, regpassword, role } = req.body;
  let errors = {};
  if (!regusername || !regemail || !regpassword || !role) {
    errors.general = "جميع الحقول مطلوبة";
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(regpassword)) {
    errors.password = "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل، حرف كبير، حرف صغير، ورقم";
  }

  try {
    const [existingUsers] = await pool.promise().query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [regusername, regemail]
    );

    if (existingUsers.length > 0) {
      errors.existingUser = "اسم المستخدم أو البريد الإلكتروني مسجل مسبقًا";
    }

    if (Object.keys(errors).length > 0) {
      return res.render("404", { errors, regusername, regemail, role ,message:null});
    }

    if (role=="broker"){
      await pool.promise().query(
      "INSERT INTO brokers (name,password,emil,role) VALUES (?,?,?,?)",
      [regusername, regpassword, regemail, role]
    );
    }
    else{
    await pool.promise().query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [regusername, regemail, regpassword, role]
    );}

    res.render("users", { role,messag: "تم تسجيل  قم الان بتسجيل دخول " });

  } catch (err) {
    console.error("Error during registration:", err);
    res.render("404", { errors: { general: "حدث خطأ أثناء التسجيل" }, regusername, regemail, role ,message:null});
  }
};
module.exports = { login , registration }; 