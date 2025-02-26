const express = require("express");
const likesRoutes = express.Router();
const {ubdutlikes} = require("../controllers/likesController");

//likesRoutes.get('/ubdutlikes',ubdutlikes);
likesRoutes.post('/update-likes/:id', ubdutlikes);


module.exports =  {likesRoutes};