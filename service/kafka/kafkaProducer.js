const kafkaService = require('../kafka/kafkaConfig');

async function sendHoldingKrStock(stockName, userId, stockCode, amount, price, totalPrice, inOutCash, inOutType) {
    await kafkaService.kafkaProducer.send({
        topic : 'request_complete_stock',
        messages: [{
            key : 'order_group',
            value : JSON.stringify({
                stockName : stockName,
                userId : userId,
                krHoldingStockId : stockCode,
                krStockAmount : amount,
                krStockPrice : price,
                krTotalPrice : totalPrice,
                inOutCash : inOutCash,
                inOutType : inOutType
            })
        }],
    });
}

async function sendHoldingKrStockSell(stockName, userId, stockCode, amount, price, totalPrice, inOutCash, inOutType) {
    await kafkaService.kafkaProducer.send({
        topic : 'request_complete_stock_sell',
        messages: [{
            key : 'order_group',
            value : JSON.stringify({
                stockName : stockName,
                userId : userId,
                krHoldingStockId : stockCode,
                krStockAmount : amount,
                krStockPrice : price,
                krTotalPrice : totalPrice,
                inOutCash : inOutCash,
                inOutType : inOutType
            })
        }],
    });
}

module.exports = {sendHoldingKrStock, sendHoldingKrStockSell};