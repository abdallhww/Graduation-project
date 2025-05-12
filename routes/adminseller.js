const express = require('express');
const adminseller = express.Router();
const { pool } = require('../utils/db'); // تأكد أنك موصل قاعدة البيانات (ممكن يكون اسم الملف مختلف)

adminseller.get('/showMerchants', (req, res) => {
  const query = "SELECT id, username, email, phone, profile_picture FROM users WHERE role = 'seller'";

  pool.query(query, (err, results) => {
    if (err) {
      console.error('خطأ في جلب التجار:', err);
      return res.status(500).send('حدث خطأ أثناء جلب بيانات التجار');
    }

    res.render('showMerchants', { merchants: results });
  });
});

module.exports = { adminseller }; 