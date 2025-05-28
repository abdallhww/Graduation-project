const express = require("express");
const notsrouts = express.Router();
const { getMyNotes } = require("../controllers/nots");

notsrouts.get('/my-notes', getMyNotes);

module.exports =  { notsrouts };  