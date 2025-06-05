const express = require('express');
const adminseller = express.Router();
const { calculateSalesReport , saveSalesReport , viewSalesReports , updatePaymentStatus , deleteReport , showMerchants } = require("../controllers/adminseller");
const { pool } = require('../utils/db'); // تأكد أنك موصل قاعدة البيانات (ممكن يكون اسم الملف مختلف)

adminseller.get('/showMerchants', showMerchants );

adminseller.get('/calculateSalesReport', calculateSalesReport );

adminseller.post('/saveSalesReport', saveSalesReport );

adminseller.get('/salesReports', viewSalesReports );

adminseller.post('/salesReports/updateStatus', updatePaymentStatus );

adminseller.post('/salesReports/delete', deleteReport );
 
module.exports = { adminseller }; 