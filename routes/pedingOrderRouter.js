var express = require("express");
var router = express.Router();
const pendingOrderService = require("../service/pendingOrder/pendingOrderService.js");
const axios = require("axios");
const marketPriceService = require("../service/marketPriceOrder/marketPriceOrder");
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
       res.status(400).json({message:'not enough money'});
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
        res.status(400).json({message:'보유 주식이 부족합니다.'});
    }
});

router.post("/buyMarketPlaceOrder", async function (req, res) {
    try{
        const totalPrice = req.body.amount * req.body.price * -1;
        const bankResult = await axios.post("http://localhost:8081/api/user/bank/cal", {userId:req.body.userId, price: totalPrice});
        if(bankResult.data.success === true){
            await marketPriceService.calculatePrice(req.body.stockName, req.body.stockCode, req.body.userId, req.body.price, req.body.amount, "buy");
            res.status(200).json({ success: true });
        }else{
            res.status(400).json({message:'not enough money'});
        }
    }catch(err){
        console.error(err);
        res.status(400).json({message:'not enough money'});
    }
});

router.post("/sellMarketPlaceOrder", async function (req, res) {
    try{
        const holdingStockResult = await axios.post("http://localhost:8085/api/holding/sell/krStock",{userId:req.body.userId, krStockId:req.body.stockCode, krStockAmount:req.body.amount});
        if(holdingStockResult.data.success === true){
            await marketPriceService.calculatePrice(req.body.stockName, req.body.stockCode, req.body.userId, req.body.price, req.body.amount, "sell");
            res.status(200).json({ success: true });
        }else{
            res.status(400).json({message:'보유 주식이 부족합니다.'});
        }
    } catch (err){
        console.error(err);
        res.status(400).json({message:'보유 주식이 부족합니다.'});
    }
});

router.get("/test", async (req, res, next) => {
    try {
        const result = await pendingOrderService.checkPrice();
        res.status(200).json(result);
    }catch(err){
        console.error(err);
    }
});

module.exports = router;
