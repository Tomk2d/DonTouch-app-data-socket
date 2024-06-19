const mongoose = require("mongoose");

const pendingOrderSchema = new mongoose.Schema(
    {
        stockName: String,
        stockCode:{
            type : String,
            required : true,
            unique : true,
        },
        pendingOrder:[
            {
                userId: Number,
                price : Number,
                amount : Number,
                buyOrSell : String
            }
        ]
    }
)
const PendingOrder = mongoose.model("PendingOrder", pendingOrderSchema);
module.exports = PendingOrder;