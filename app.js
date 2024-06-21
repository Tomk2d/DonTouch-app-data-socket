var createError = require("http-errors");
var express = require("express");
var logger = require("morgan");
let cors = require("cors");
var indexRouter = require("./routes/index");
require("dotenv").config();
const cron = require("node-cron");
const pendingOrderService = require("./service/pendingOrder/pendingOrderService.js");
const mongoose = require("mongoose");

const MONGO_HOST = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`;
mongoose.connect(MONGO_HOST, {
  retryWrites: true,
  w: "majority",
});

var app = express();
// view engine setup


app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use("/", indexRouter);

const pendingOrderRouter = require("./routes/pedingOrderRouter");
app.use("/api/pendingOrder",pendingOrderRouter);

const myPageRouter = require("./routes/myPageRouter");
app.use("/api/myPage",myPageRouter);

const graphDataRouter = require("./routes/graphStockRouter");
app.use("/api/graph", graphDataRouter);


const batchFunc = () => {
  cron.schedule('*/2 * * * * 1-5', async() => {
    try {
      await pendingOrderService.checkPrice();
      console.log("예상가 체결 대조 중...");
    } catch (err) {
      console.log(err);
    }
  }, {scheduled:true, timezone:'Asia/Seoul'});
}

batchFunc();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
