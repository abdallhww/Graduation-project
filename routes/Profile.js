const express = require("express");
const ProfileRouter = express.Router();
const { upload , uploadImage , updateBroker , updateusers , home , homes ,
     logout , showUserMessages , viewMySalesReports , showBrokerOrders , addBrokerNote} = require("../controllers/Profile");

ProfileRouter.post('/upload', upload.single('image'), uploadImage);

ProfileRouter.post('/home',home);

ProfileRouter.post('/updateBroker',updateBroker);

ProfileRouter.post('/updateusers',updateusers);

ProfileRouter.get('/homes',homes);

ProfileRouter.post('/logout',logout);

ProfileRouter.get("/user/messages", showUserMessages);

ProfileRouter.post('/mySalesReports', viewMySalesReports);

ProfileRouter.post('/broker/orders', showBrokerOrders);

ProfileRouter.post('/broker/add-note',addBrokerNote);

module.exports =   { ProfileRouter };