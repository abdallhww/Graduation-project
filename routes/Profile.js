const express = require("express");
const ProfileRouter = express.Router();
const {upload,uploadImage,updateBroker,updateusers,home,homes} = require("../controllers/Profile");

ProfileRouter.post('/upload', upload.single('image'), uploadImage);

ProfileRouter.post('/home',home);

ProfileRouter.post('/updateBroker',updateBroker);

ProfileRouter.post('/updateusers',updateusers);

ProfileRouter.get('/homes',homes);

module.exports =  {ProfileRouter};