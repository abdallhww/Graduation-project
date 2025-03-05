const express = require("express");
const homeRouter = express.Router();
const {Technicalsupport,Brokers,Viewproducts,Profile} = require("../controllers/home");

homeRouter.get('/Technicalsupport',Technicalsupport);

homeRouter.get('/Brokers', Brokers);

homeRouter.get('/Viewproducts',Viewproducts);

homeRouter.get('/Profile',Profile);

module.exports =  {homeRouter};