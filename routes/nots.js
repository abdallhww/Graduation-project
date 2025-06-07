const express = require("express");
const notsrouts = express.Router();
const { getMyNotes , getBrokerNotes , replyToNote } = require("../controllers/nots");

notsrouts.get('/my-notes', getMyNotes );

notsrouts.get('/brokerNotes', getBrokerNotes );

notsrouts.post('/replyNote', replyToNote );

module.exports =  { notsrouts };  