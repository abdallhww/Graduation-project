const express = require("express");
const admanRouter = express.Router();
const {showmassge,updateStatus,getSupportStats,goadminhome} = require("../controllers/admin");

admanRouter.post('/goadminhome',goadminhome);

admanRouter.get('/showmassge',showmassge);

admanRouter.post("/updateStatus", updateStatus);

admanRouter.get("/supportStats", getSupportStats);

module.exports =  {admanRouter};