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

async function sendHoldingUsStock(stockName, userId, stockCode, amount, price, totalPrice, inOutCash, inOutType) {
    await kafkaService.kafkaProducer.send({
        topic : 'request_complete_stock_us',
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
async function sendHoldingUsStockSell(stockName, userId, stockCode, amount, price, totalPrice, inOutCash, inOutType) {
    await kafkaService.kafkaProducer.send({
        topic : 'request_complete_stock_sell_us',
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

async function sendBuyCombinationKrStock(stockName, userId, stockCode, amount, price, totalPrice, inOutCash, inOutType, combinationId) {
    await kafkaService.kafkaProducer.send({
        topic : 'request_buy_combination_stock',
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
                inOutType : inOutType,
                combinationId : combinationId,
            })
        }],
    });
}

async function sendBuyCombinationUsStock(stockName, userId, stockCode, amount, price, totalPrice, inOutCash, inOutType, combinationId) {
    console.log("=======둘어옴========")
    await kafkaService.kafkaProducer.send({
        topic : 'request_buy_combination_stock_us',
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
                inOutType : inOutType,
                combinationId : combinationId,
            })
        }],
    });
}

module.exports = {sendHoldingKrStock, sendHoldingKrStockSell, sendHoldingUsStockSell,sendHoldingUsStock, sendBuyCombinationKrStock, sendBuyCombinationUsStock};