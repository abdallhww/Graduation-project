const express = require("express");
const homeRouter = express.Router();
const {Technicalsupport,Brokers,Viewproducts} = require("../controllers/home");

homeRouter.get('/Technicalsupport',Technicalsupport);
homeRouter.get('/Brokers', Brokers);
homeRouter.get('/Viewproducts',Viewproducts);
module.exports =  {homeRouter};