const express = require("express");
const ProfileRouter = express.Router();
const {upload,uploadImage,updateBroker  } = require("../controllers/Profile");

ProfileRouter.post('/upload', upload.single('image'), uploadImage);
ProfileRouter.post('/updateBroker',updateBroker)

module.exports =  {ProfileRouter};