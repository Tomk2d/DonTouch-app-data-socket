const axios = require('axios');
const stockPriceService = require('../stockPrice/stockPrice');
const kafkaProducer = require("../kafka/kafkaProducer");

async function calculatePrice(stockName, stockCode, userId, price, amount , buyOrSell) {
    const nowPrice = await stockPriceService.getStockPrice(stockCode);
    if(buyOrSell === 'buy' && price >= nowPrice) {
        await kafkaProducer.sendHoldingKrStock(stockName, userId, stockCode, amount, price, price*amount, price*amount, 0);
        console.log(
            "구매된 주식 : ",
            {
                stockName : stockName,
                userId : userId,
                stockCode : stockCode,
                amount : amount,
                price : price,
                totalPrice : price*amount,
                buyOrSell : buyOrSell
            }
        );
    }else if(buyOrSell === 'sell' && price <= nowPrice) {
        await kafkaProducer.sendHoldingKrStockSell(stockName, userId, stockCode, amount, price, price*amount, price*amount, 1);
        console.log(
            "판매된 주식 : ",
            {
                stockName : stockName,
                userId : userId,
                stockCode : stockCode,
                amount : amount,
                price : price,
                totalPrice : price*amount,
                buyOrSell : buyOrSell
            }
        );
    }
}

module.exports = {calculatePrice};