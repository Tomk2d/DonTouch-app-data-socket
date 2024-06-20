const PendingOrder = require('../../model/PendingOrder');
const stockPrice = require('../stockPrice/stockPrice');
const kafkaProducer = require('../kafka/kafkaProducer');
const axios = require("axios");
// 유저의 주문 조회
async function getUserPendingOrder(userId) {
    try{
        let pendingOrder = await PendingOrder.find({});
    }catch(err){
        console.log(err);
    }
}
// 주문 저장하기
async function savePendingOrderById(stockName, stockCode, userId, price, amount , buyOrSell) {
    try {
        const data = {
            userId: userId,
            price: price,
            amount: amount,
            buyOrSell: buyOrSell
        };
        let existingOrder = await PendingOrder.findOne({ stockCode: stockCode });

        if (existingOrder) {
            existingOrder.pendingOrder.push(data); // 기존 PendingOrder에 새 데이터 추가
            const updatedOrder = await existingOrder.save();
            return updatedOrder;
        } else {
            // 존재하지 않는 경우, 새로운 PendingOrder를 생성합니다.
            const newOrder = await PendingOrder.create({
                stockCode: stockCode,
                stockName: stockName,
                pendingOrder: [data]  // 새로운 주문을 배열의 첫 번째 요소로 추가
            });
            return newOrder;
        }
    } catch (err) {
        console.error("주문 저장 중 오류 발생:", err);
        throw err; // 오류를 호출자에게 전파
    }
}

async function getPendingOrdersByStockCode(stockCode){
    let pendingOrders = PendingOrder.find({stockCode: stockCode});
    return pendingOrders;
}
// 모든 주문 불러오기
async function getAllPendingOrders() {
    let orderList = [];
    let pendingOrders = await PendingOrder.find({});
    for (let order of pendingOrders) {
        orderList.push(order.stockCode);
    }
    return orderList;
}

// 여기가 계산 함수
async function checkPrice() {
    let reservedStockList = await getAllPendingOrders();
    for (let reservedStock of reservedStockList) {
        // 총 예약된 애들중 주식 코드
        let code = reservedStock;
        // db 에 있는 주식 코드 객체
        let pendingOrders = await PendingOrder.findOne({stockCode: code});
        // 객체에 있는 예약들
        const resultArray = pendingOrders.pendingOrder;
        // 예약이 없을경우 넘김.
        if (resultArray.length === 0) {
            continue;
        }

        // 해당 주식 코드의 현재가
        let nowPrice = await stockPrice.getStockPrice(code);

        for (let order of resultArray) {
            if (order.buyOrSell === "buy" && order.price >= nowPrice) {
                const completeOrder = resultArray.find(o => o._id === order._id);
                await PendingOrder.updateOne(
                    { stockCode: code },
                    { $pull: { pendingOrder: { _id: order._id } } }
                );
                await kafkaProducer.sendHoldingKrStock(pendingOrders.stockName, completeOrder.userId, code, completeOrder.amount, completeOrder.price, completeOrder.price*completeOrder.amount, completeOrder.price*completeOrder.amount, 0);
                console.log(" 구매 완료된애 ==============",completeOrder);
            }else if (order.buyOrSell === "sell" && order.price <= nowPrice) {
                const completeOrder = resultArray.find(o => o._id === order._id);
                await PendingOrder.updateOne(
                    { stockCode: code },
                    { $pull: { pendingOrder: { _id: order._id } } }
                )
                await kafkaProducer.sendHoldingKrStockSell(pendingOrders.stockName, completeOrder.userId, code, completeOrder.amount, completeOrder.price, completeOrder.price*completeOrder.amount, completeOrder.price*completeOrder.amount, 1);
                const bankResult = await axios.post("http://localhost:8081/api/user/bank/cal", {userId:completeOrder.userId, price:(completeOrder.price*completeOrder.amount)});
                console.log(" 판매 완료된애 ==============",completeOrder);
            }
        }
    }
}



module.exports = {getUserPendingOrder, savePendingOrderById, checkPrice};