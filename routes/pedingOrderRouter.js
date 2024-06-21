var express = require("express");
var router = express.Router();
const pendingOrderService = require("../service/pendingOrder/pendingOrderService.js");
const axios = require("axios");
const marketPriceService = require("../service/marketPriceOrder/marketPriceOrder");
const stockPriceService = require("../service/stockPrice/stockPrice");
require("dotenv").config();


router.get("/myPendingOrder/:userId", async function (req, res) {
    try {
        const result = await pendingOrderService.getUserPendingOrder(req.params.userId);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error getting stock data from Redis:', err);
        res.status(500).json({ error: 'Error getting stock data from Redis', details: err });
    }
});

router.post("/buyPendingOrder", async function (req, res) {
   try{
       const totalPrice = req.body.amount * req.body.price * -1;
       const bankResult = await axios.post("http://localhost:8081/api/user/bank/cal", {userId:req.body.userId, price: totalPrice});
       if(bankResult.data.success === true){
           await pendingOrderService.savePendingOrderById(req.body.stockName, req.body.stockCode, req.body.userId, req.body.price, req.body.amount, "buy");
           res.status(200).json({ success: true });
       }else{
           res.status(400).json({message:'not enough money'});
       }
   } catch (err){
       console.error(err);
       res.status(400).json({message:'서버에러'});
   }
});

router.post("/sellPendingOrder", async function (req, res) {
    try{
        const holdingStockResult = await axios.post("http://localhost:8085/api/holding/sell/krStock",{userId:req.body.userId, krStockId:req.body.stockCode, krStockAmount:req.body.amount});
        if(holdingStockResult.data.success === true){
            const result = await pendingOrderService.savePendingOrderById(req.body.stockName, req.body.stockCode, req.body.userId, req.body.price, req.body.amount, "sell");
            res.status(200).json({ success: true });
        }else{
            res.status(400).json({message:'보유 주식이 부족합니다.'});
        }
    } catch (err){
        console.error(err);
        res.status(400).json({message:'서버에러'});
    }
});

router.post("/buyMarketPlaceOrder", async function (req, res) {
    try{
        let nowPrice = await stockPriceService.getStockPrice(req.body.stockCode);
        nowPrice = parseInt(nowPrice);
        const totalPrice = req.body.amount * nowPrice * -1;
        const bankResult = await axios.post("http://localhost:8081/api/user/bank/cal", {userId:req.body.userId, price: totalPrice});
        if(bankResult.data.success === true){
            await marketPriceService.calculatePrice(req.body.stockName, req.body.stockCode, req.body.userId, nowPrice, req.body.amount, "buy");
            res.status(200).json({ success: true });
        }else{
            res.status(400).json({message:'not enough money'});
        }
    }catch(err){
        console.error(err);
        res.status(400).json({message:'서버에러'});
    }
});

router.post("/sellMarketPlaceOrder", async function (req, res) {
    try{
        const nowPrice = await stockPriceService.getStockPrice(req.body.stockCode);
        const holdingStockResult = await axios.post("http://localhost:8085/api/holding/sell/krStock",{userId:req.body.userId, krStockId:req.body.stockCode, krStockAmount:req.body.amount});
        if(holdingStockResult.data.success === true){
            await marketPriceService.calculatePrice(req.body.stockName, req.body.stockCode, req.body.userId, nowPrice, req.body.amount, "sell");
            res.status(200).json({ success: true });
        }else{
            res.status(400).json({message:'보유 주식이 부족합니다.'});
        }
    } catch (err){
        console.error(err);
        res.status(400).json({message:'서버에러'});
    }
});

router.post("/buyMarketPlaceOrderUs", async function (req, res) {
    try{
        let nowPrice = await stockPriceService.getStockPriceUs(req.body.stockCode, req.body.marketType);
        const totalPrice = req.body.amount * nowPrice * -1;
        const bankResult = await axios.post("http://localhost:8081/api/user/bank/cal", {userId:req.body.userId, price: totalPrice});
        if(bankResult.data.success === true){
            await marketPriceService.calculatePriceUs(req.body.stockName, req.body.stockCode, req.body.userId, nowPrice, req.body.amount, "buy");
            res.status(200).json({ success: true });
        }else{
            res.status(400).json({message:'not enough money'});
        }
    }catch(err){
        console.error(err);
        res.status(400).json({message:'서버에러'});
    }
});

router.post("/sellMarketPlaceOrderUs", async function (req, res) {
    try{
        const nowPrice = await stockPriceService.getStockPriceUs(req.body.stockCode, req.body.marketType);
        const holdingStockResult = await axios.post("http://localhost:8085/api/holding/sell/usStock",{userId:req.body.userId, usStockId:req.body.stockCode, usStockAmount:req.body.amount});
        if(holdingStockResult.data.success === true){
            await marketPriceService.calculatePriceUs(req.body.stockName, req.body.stockCode, req.body.userId, nowPrice, req.body.amount, "sell");
            res.status(200).json({ success: true });
        }else{
            res.status(400).json({message:'보유 주식이 부족합니다.'});
        }
    } catch (err){
        console.error(err);
        res.status(400).json({message:'서버에러'});
    }
});

router.post("/buyCombinationStock", async function (req, res) {
    try{
        const stockList = req.body.stockList;
        const combinationId = Math.floor(Math.random() * 999999999) + 1;
        for (stockItem of stockList) {
            const marketType = stockItem.marketType;
            if(stockItem.marketType === "KSC"){
                const nowPrice = await stockPriceService.getStockPrice(stockItem.stockCode);
                const totalPrice = nowPrice * stockItem.amount*-1;
                const bankResult = await axios.post("http://localhost:8081/api/user/bank/cal", {userId:req.body.userId, price: totalPrice});
                if(bankResult.data.success === true){
                    await marketPriceService.calculateCombinationPrice(stockItem.stockName, stockItem.stockCode, req.body.userId, nowPrice, stockItem.amount, "buy", combinationId,marketType);
                }else{
                    res.status(400).json({message:'not enough money'});
                }
            }else if(stockItem.marketType === "BAY" || stockItem.marketType === "BAQ"){
                const nowPrice = await stockPriceService.getStockPriceUs(stockItem.stockCode, stockItem.marketType);
                const totalPrice = nowPrice * stockItem.amount*-1;
                const bankResult = await axios.post("http://localhost:8081/api/user/bank/cal", {userId:req.body.userId, price: totalPrice});
                if(bankResult.data.success === true){
                    await marketPriceService.calculateCombinationPrice(stockItem.stockName, stockItem.stockCode, req.body.userId, nowPrice, stockItem.amount, "buy",combinationId, marketType);
                }else{
                    res.status(400).json({message:'not enough money'});
                }
            }
        }
        res.status(200).json({ success: true });
    }catch(err){
        console.error(err);
        res.status(400).json({success:false});
    }
});

router.get("/test", async (req, res, next) => {
    try {
        const result = await stockPriceService.getStockPriceUs("TSLA");
        res.status(200).json(result);
    }catch(err){
        console.error(err);
    }
});

module.exports = router;
