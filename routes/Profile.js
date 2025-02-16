const express = require("express");
const ProfileRouter = express.Router();
const {upload,uploadImage } = require("../controllers/Profile");

ProfileRouter.post('/upload', upload.single('image'), uploadImage);

module.exports =  {ProfileRouter};