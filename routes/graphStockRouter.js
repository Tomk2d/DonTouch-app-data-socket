var express = require("express");
var router = express.Router();
const pendingOrderService = require("../service/pendingOrder/pendingOrderService.js");
const axios = require("axios");
const marketPriceService = require("../service/marketPriceOrder/marketPriceOrder");
const stockPriceService = require("../service/stockPrice/stockPrice");
require("dotenv").config();


router.post("/graphData", async function (req, res) {
    try{
        const response = await stockPriceService.getGraphKRData(
            req.body.timeFormat,
            req.body.stockCode,
            req.body.endDate
        );
        res.status(200).json(response);
    }catch(err){
        res.status(400).json({message: err.message});
    }
})


module.exports = router;
