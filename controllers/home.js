const { pool } = require("../utils/db");

const Technicalsupport = (req, res, next) => {
  res.render("Technicalsupport", { title: "Technical" });
  res.end();
};

const Profile = (req, res, next) => {
  if (!req.session.userId) {
    console.log(req.session.userId);
    return res
      .status(401)
      .render("404", { message: "Unauthorized", errors: null });
  }

  const userId = req.session.userId;
  const userRole = req.session.role;

  let query = "";
  if (userRole === "broker") {
    query =
      "SELECT id,name, emil, role, phone,password, image, details, Facebook_account,created_at, website, Instagram_account FROM brokers WHERE id = ?";
  } else {
    query =
      "SELECT id,username, email,password, role, phone, profile_picture,created_at FROM users WHERE id = ?";
  }

  console.log(userId);
  console.log(userRole);

  pool.query(query, [userId], (err, results) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.render("404", { message: "Database error", errors: null });
    }
    if (results.length === 0) {
      console.log(
        "❌ User not found in",
        userRole === "broker" ? "brokers" : "users"
      );
      return res.render("404", { message: "User not found", errors: null });
    }

    if (userRole === "broker") {
      res.render("Profilebroker", { broker: results[0] });
    } 
    else if (userRole === "seller") {
      res.render("Profileselers", { user: results[0] ,message: "hi"});
    }
    else {
      res.render("Profile", { user: results[0] });
    }
  });
};

const Brokers = (req, res, next) => {
  const query = "SELECT * FROM brokers";
  pool.query(query, (err, rows) => {
    if (err) return next(err);
    res.render("Brokers", { brokers: rows,message:null });
  });
};

const Brokers2 = (req, res, next) => {
  const userId = req.session.userId;
  const orderId = req.query.orderId; 

  console.log(orderId);

  const query = "SELECT * FROM brokers";
  pool.query(query, (err, rows) => {
    if (err) return next(err);
    res.render("Brokers2", { brokers: rows, userId, orderId });
  });
};


const Viewproducts = (req, res, next) => {

  const userId = req.session.userId;

  console.log(userId);

  pool.query("SELECT * FROM products", (err, rows) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Error fetching products" });
    }
    res.render("Viewproducts", { products: rows , userId});
  });

};

const send = (req, res, next) => {
  const { name, email, message } = req.body;
  const userId = req.session.userId;         
  const brokerId = req.session.brokerId;     

  if (!userId && !brokerId) {
    return res.status(401).send('يجب تسجيل الدخول أولاً.');
  }
console.log("userid = "+userId+"  "+"brokerId = "+brokerId);

  // التحقق من المستخدم العادي
  if (req.session.role=="seller"||req.session.role=="buyer") {
    const checkUserSql = "SELECT * FROM users WHERE id = ? AND username = ? AND email = ?";
    pool.query(checkUserSql, [userId, name, email], (err, results) => {
      if (err) {
        console.error("خطأ في التحقق من المستخدم:", err);
        return res.status(500).send("حدث خطأ داخلي.");
      }

      if (results.length === 0) {
        return res.status(400).render("supportError", {
          message: "الاسم أو البريد الإلكتروني غير صحيح."
        });
      }

      const insertSql = "INSERT INTO support_messages (user_id , name , email , message , status) VALUES (?, ?, ?, ?,'بانتظار الرد')";
      pool.query(insertSql, [userId, name, email, message], (err, result) => {
        if (err) {
          console.error("خطأ أثناء التخزين:", err);
          return res.status(500).send("حدث خطأ أثناء إرسال الرسالة.");
        }
       console.log("delet broker scsess");
        res.render("supportSuccess", {
          message: "تم إرسال رسالتك بنجاح! شكراً لتواصلك معنا.",
          name
        });
      });
    });
  }

  // التحقق من الوسيط
  else if (req.session.role === "broker") {
    const checkBrokerSql = "SELECT * FROM brokers WHERE id = ? AND name = ? AND emil = ?";
    pool.query(checkBrokerSql, [userId, name, email], (err, results) => {
      if (err) {
        console.error("خطأ في التحقق من الوسيط:", err);
        return res.status(500).send("حدث خطأ داخلي.");
      }

      if (results.length === 0) {
        return res.status(400).render("supportError", {
          message: "الاسم أو البريد الإلكتروني غير صحيح (وسيط)."
        });
      }

      const insertSql = "INSERT INTO support_messages (user_id , name , email , message , status) VALUES (?, ?, ?, ?,'بانتظار الرد')";
      pool.query(insertSql, [userId, name, email, message], (err, result) => {
        if (err) {
          console.error("خطأ أثناء التخزين (وسيط):", err);
          return res.status(500).send("حدث خطأ أثناء إرسال الرسالة.");
        }

        res.render("supportSuccess", {
          message: "تم إرسال رسالتك بنجاح أيها الوسيط! سنقوم بالتواصل معك.",
          name
        });
      });
    });
  }
};

module.exports = { Brokers , Technicalsupport , Viewproducts , Profile , send , Brokers2 };