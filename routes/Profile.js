const express = require("express");
const ProfileRouter = express.Router();
const {upload,uploadImage,updateBroker,updateusers,home,homes,logout} = require("../controllers/Profile");

ProfileRouter.post('/upload', upload.single('image'), uploadImage);

ProfileRouter.post('/home',home);

ProfileRouter.post('/updateBroker',updateBroker);

ProfileRouter.post('/updateusers',updateusers);

ProfileRouter.get('/homes',homes);

ProfileRouter.post('/logout',logout);

module.exports =  {ProfileRouter};