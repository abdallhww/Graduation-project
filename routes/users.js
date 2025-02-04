const express = require("express");
const usersRouter = express.Router();

const { getAllUsers,addNewUser} = require("../controllers/users");
// /users
usersRouter.get("/", getAllUsers);
//  "/users/add-user"
usersRouter.post("/add-user", addNewUser);

module.exports =  {usersRouter};