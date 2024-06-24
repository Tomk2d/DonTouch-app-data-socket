var express = require("express");
var router = express.Router();
const pendingOrderService = require("../service/pendingOrder/pendingOrderService.js");
const axios = require("axios");
const marketPriceService = require("../service/marketPriceOrder/marketPriceOrder");
const stockPriceService = require("../service/stockPrice/stockPrice");
require("dotenv").config();

router.post("/krStock", async function (req, res) {
    try{
        const stockList = req.body.stockList;
        let i= 0;
        let resultArray = [];
        // 사용 예시

        for(stockItem of stockList){
            setTimeout(() => {}, i * 50);
            i++;

            const stockPrice = await stockPriceService.getMyPageKrStockPrice(stockItem);
            resultArray.push(stockPrice);
        }
        res.status(200).json(resultArray);
    }catch(err){
        res.status(500).json(err);
    }
});

router.post("/usStock", async function (req, res) {
    try{
        const stockList = req.body.stockList;
        let i= 0;
        let resultArray = [];
        for(stockItem of stockList){
            setTimeout(() => {}, i * 50);
            i++;

            const stockPrice = await stockPriceService.getMyPageUsStockPrice(stockItem.stockCode, stockItem.marketType);
            resultArray.push(stockPrice);
        }
        res.status(200).json(resultArray);
    }catch(err){
        res.status(500).json(err);
    }
});


module.exports = router;