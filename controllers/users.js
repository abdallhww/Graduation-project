const fs = require("fs");
const path = require("path");

//const usersFile = path.join(__dirname, "../users.json");

const login = (req, res,next) => {
  const { username, password } = req.body;

  if (username === 'abd' && password === '0000') {
      res.render('home');
  } else {
      res.send('خطأ في تسجيل الدخول');
  }
};
const registration = (req, res,next) => {
  const { regusername,regemail, regpassword,role } = req.body;

  if (regusername === 'a' && regpassword === '00'&&regemail === 'a@a' && role === 'a') {
      res.render('home');
  } else {
      res.send('خطأ في تسجيل الدخول');
  }
};
module.exports = {login,registration};