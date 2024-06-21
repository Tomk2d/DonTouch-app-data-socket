const { Server } = require("socket.io");
const WebSocket = require("ws");
const EventEmitter = require("events");
class WebSocketEventEmitter extends EventEmitter {}
const stockEmitter = new WebSocketEventEmitter();
require("dotenv").config();

const io = new Server({
  cors: {
    origin: "http://127.0.0.1:5173",
    methods: ["GET", "POST"],
  },
});

const wsConnections = new Map(); // 코드별 WebSocket 연결 관리

function webSocketConnect(code) {
  if (wsConnections.has(code)) {
    console.log(`WebSocket for code ${code} already exists.`);
    return;
  }
  console.log("webSocketConnect", code);

  const ws = new WebSocket("ws://ops.koreainvestment.com:21000");

  ws.on("open", function open() {
    console.log(`한국투자증권 소켓 연결 완료 for code ${code}`);
    sendInitialMessages(ws, code);
  });

  ws.on("message", function incoming(data) {
    const messageString = data.toString();
    if (messageString[0] === "0" || messageString[0] === "1") {
      let messageArray = messageString.split("|");
      let trid = messageArray[1];
      let priceStr = messageArray[3];

      if (trid === "H0STCNT0") {
        let priceArray = priceStr.split("^");
        let response = {
          code: priceArray[0],
          time: priceArray[1],
          close: priceArray[2],
          open: priceArray[7],
          high: priceArray[8],
          low: priceArray[9],
        };
        //console.log("연결됨 : ",code);
        console.log("실시간 주가오는중 ====== ", response);
        io.to(priceArray[0]).emit("nowPrice", { message: response });
      } else if (trid === "H0STASP0") {
        let priceArray = priceStr.split("^");
        let response = {
          code: priceArray[0],
          time: priceArray[1],
          sellPrice: priceArray.slice(3, 13),
          buyPrice: priceArray.slice(13, 23),
          sellAmount: priceArray.slice(23, 33),
          buyAmount: priceArray.slice(33, 43),
        };
        console.log("실시간 호가오는중 ====== ", response);
        io.to(priceArray[0]).emit("askPrice", { message: response });
        stockEmitter.emit(priceArray[0], response);
      } else {
        console.log("Unknown TRID:", trid);
      }
    } else {
      console.log("Header:", messageString);
    }
  });

  ws.on("close", function close() {
    console.log(`웹소켓 연결 종료 for code ${code}`);
    wsConnections.delete(code);
    stockEmitter.removeAllListeners(code); // Remove event listeners for the specific code
  });

  ws.on("error", function error(err) {
    console.error(`웹소켓 연결 오류 for code ${code}:`, err);
    wsConnections.delete(code);
    stockEmitter.removeAllListeners(code); // Remove event listeners for the specific code
  });

  wsConnections.set(code, ws);
}

function sendInitialMessages(ws, code) {
  const messageNow = JSON.stringify({
    header: {
      approval_key: process.env.SOCKET_TOKEN_1,
      custtype: "P",
      tr_type: "1",
      "content-type": "utf-8",
    },
    body: {
      input: {
        tr_id: "H0STCNT0",
        tr_key: code,
      },
    },
  });
  ws.send(messageNow);

  const messageAsk = JSON.stringify({
    header: {
      approval_key: process.env.SOCKET_TOKEN_1,
      custtype: "P",
      tr_type: "1",
      "content-type": "utf-8",
    },
    body: {
      input: {
        tr_id: "H0STASP0",
        tr_key: code,
      },
    },
  });
  ws.send(messageAsk);
}

io.on("connection", (socket) => {
  console.log("클라이언트가 연결되었습니다.");

  socket.on("joinRoom", (code) => {
    console.log(`${socket.id} is joining room ${code}`);
    socket.join(code);
    webSocketConnect(code);
    console.log(" 열린 방의 수 : ", socket.rooms);
  });

  socket.on("leaveRoom", (code) => {
    console.log(`${socket.id} is leaving room ${code}`);
    socket.leave(code);

    // 방에 남아 있는 유저 수 체크
    const room = io.sockets.adapter.rooms.get(code);
    const numClients = room ? room.size : 0;

    // 방에 유저가 없을 때만 WebSocket 연결 종료
    if (numClients === 0 && wsConnections.has(code)) {
      const ws = wsConnections.get(code);
      ws.close(1000); // WebSocket 연결 정상 종료
    }

    console.log(" 열린 방의 수 : ", socket.rooms);
  });
});

(module.exports = io), stockEmitter;
