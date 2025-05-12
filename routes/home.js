const express = require("express");
const homeRouter = express.Router();
const { Technicalsupport , Brokers , Brokers2 , Viewproducts , Profile , send } = require("../controllers/home");

homeRouter.get('/Technicalsupport',Technicalsupport);

homeRouter.get('/Brokers', Brokers);

homeRouter.get('/Brokers2', Brokers2);

homeRouter.get('/Viewproducts',Viewproducts);

homeRouter.get('/Profile',Profile);

homeRouter.post('/send',send);

module.exports =  { homeRouter };