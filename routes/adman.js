const express = require("express");
const admanRouter = express.Router();
const {showmassge , updateStatus , getSupportStats , goadminhome , deleteMessage , viweBrokers , deletBroker
    , searchBroker , searchBroker2 , showmassf , replyMessage , searchMerchantProducts } = require("../controllers/admin");

admanRouter.post('/goadminhome', goadminhome );

admanRouter.get('/showmassge', showmassge );

admanRouter.post('/updateStatus', updateStatus );

admanRouter.get('/supportStats', getSupportStats );

admanRouter.post('/deleteMessage', deleteMessage );

admanRouter.get('/viweBrokers', viweBrokers );

admanRouter.post('/deletBroker', deletBroker );

admanRouter.get('/searchBroker', searchBroker );

admanRouter.get('/searchBroker2', searchBroker2 );

admanRouter.post('/showmassf', showmassf );

admanRouter.post('/replyMessage', replyMessage );

admanRouter.get('/searchMerchantProducts', searchMerchantProducts );

module.exports =  { admanRouter };