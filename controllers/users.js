const { pool } = require("../utils/db");

const login = (req, res,next) => {
  const { username, password } = req.body;

  if (username === 'abd' && password === '0000') {
    const role = req.body.role;
    res.render('home', { role }); 
  } else {
      res.send('خطأ في تسجيل الدخول');
  }
};

const registration = (req, res,next) => {
  const { regusername,regemail, regpassword,role} = req.body;
  pool.query(
    `INSERT INTO users (username, email, password,role) VALUES (?, ?, ?,?)`,
    [regusername, regemail, regpassword,role],
    (err, fileds) => {
      if (err) {
        res.status(500).json({ message: "Error!", error: err });
        return;
      }
      //res.status(201).json({ message: "add new user success", user: fileds });
      res.render('home', { role }); 
    }
  );
};
module.exports = {login,registration};