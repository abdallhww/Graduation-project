const { pool } = require("../utils/db");
const bcrypt = require('bcrypt');

const login = async (req, res, next) => {
  const { username, password } = req.body;
  let errors = {};
  if (!username || !password) {
    errors.general = "اسم المستخدم وكلمة السر مطلوبان";
    return res.render("404", { errors });
  }

  try {
    const [existingUser] = await pool.promise().query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, username] // اسم المستخدم أو البريد الإلكتروني
    );

    if (existingUser.length === 0) {
      errors.general = "اسم المستخدم أو البريد الإلكتروني غير موجود";
      return res.render("404", { errors });
    }
    const isPasswordValid = existingUser[0].password === password; // يمكن استخدام bcrypt هنا لتشفير ومقارنة كلمة السر
    if (!isPasswordValid) {
      errors.general = "كلمة السر غير صحيحة";
      return res.render("404", { errors });
    }

    // التحقق من الدور لتوجيه المستخدم بشكل مناسب
    const role = existingUser[0].role;
    res.render("home", { role });

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
    errors.password = "Password must contain at least 8 characters, an uppercase letter, a lowercase letter, and a number";
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
      return res.render("404", { errors, regusername, regemail, role });
    }


    //const hashedPassword = await bcrypt.hash(regpassword, 10);
    if (role=="broker"){
      await pool.promise().query(
      "INSERT INTO brokers (name,password,emil,role) VALUES (?,?,?,?)",
      [regusername, regemail, regpassword, role]
    );
    }
    else{
    await pool.promise().query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [regusername, regemail, regpassword, role]
    );}

    res.render("home", { role });

  } catch (err) {
    console.error("Error during registration:", err);
    res.render("404", { errors: { general: "حدث خطأ أثناء التسجيل" }, regusername, regemail, role });
  }
};
module.exports = {login,registration};