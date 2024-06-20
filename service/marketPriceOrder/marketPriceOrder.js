const stockPriceService = require('../stockPrice/stockPrice');
const kafkaProducer = require("../kafka/kafkaProducer");

async function calculatePrice(stockName, stockCode, userId, price, amount , buyOrSell) {
    if(buyOrSell === 'buy') {
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
    }else if(buyOrSell === 'sell') {
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

async function calculatePriceUs(stockName, stockCode, userId, price, amount , buyOrSell) {
    if(buyOrSell === 'buy') {
        await kafkaProducer.sendHoldingUsStock(stockName, userId, stockCode, amount, price, price*amount, price*amount, 0);
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
    }else if(buyOrSell === 'sell') {
        await kafkaProducer.sendHoldingUsStockSell(stockName, userId, stockCode, amount, price, price*amount, price*amount, 1);
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

async function calculateCombinationPrice(stockName, stockCode, userId, price, amount , buyOrSell, combinationId, marketType) {
    console.log("marketType : ",marketType);
    if(marketType === 'kr') {
        await kafkaProducer.sendBuyCombinationKrStock(stockName, userId, stockCode, amount, price, price*amount, price*amount, 0, combinationId);
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
    }else if(marketType === 'us') {
        await kafkaProducer.sendBuyCombinationUsStock(stockName, userId, stockCode, amount, price, price*amount, price*amount, 0, combinationId);
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
    }
}

module.exports = {calculatePrice, calculatePriceUs,calculateCombinationPrice};