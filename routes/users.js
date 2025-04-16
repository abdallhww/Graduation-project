const express = require("express");
const usersRouter = express.Router();
const {login,registration } = require("../controllers/users");

usersRouter.get('/login', (req, res) => {
    res.render("users", { title: "=>Shop Store",message:null,messag:"مرحبا بك في متجر و موقع الذي يجمع وسطاء "});
    res.end();
});

usersRouter.post('/login', login);

usersRouter.post('/registration',registration);

module.exports =  {usersRouter}; 