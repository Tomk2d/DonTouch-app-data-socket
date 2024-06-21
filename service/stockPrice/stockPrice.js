const axios = require("axios");
const path = require("path");
require("dotenv").config();

// 1. 실시간 가격 대조 - 예약 스키마랑 배치
async function getStockPriceRealTime(code) {

    const headers={
        'content-type' : 'application/json; charset=utf-8',
        'authorization': `Bearer ${process.env.VTS_TOKEN_1}`,
        'appkey': process.env.VTS_APPKEY_1,
        'appsecret': process.env.VTS_APPSECRET_1,
        'tr_id': 'FHKST01010100'
    }

    const params = {
        'fid_cond_mrkt_div_code' : 'J',
        'fid_input_iscd' : code
    }

    const response = await axios.get(
        `${process.env.VTS_1}/uapi/domestic-stock/v1/quotations/inquire-price`,
        {headers, params}
    );

    const priceArray = response.data.output;
    const result = priceArray.stck_prpr;

    console.log("결과 :" ,result);

    return result;
}

// 2. 시장가 한국 거래.
async function getStockPrice(code) {

    const headers={
        'content-type' : 'application/json; charset=utf-8',
        'authorization': `Bearer ${process.env.VTS_TOKEN_2}`,
        'appkey': process.env.VTS_APPKEY_2,
        'appsecret': process.env.VTS_APPSECRET_2,
        'tr_id': 'FHKST01010100'
    }

    const params = {
        'fid_cond_mrkt_div_code' : 'J',
        'fid_input_iscd' : code
    }

    const response = await axios.get(
        `${process.env.VTS_2}/uapi/domestic-stock/v1/quotations/inquire-price`,
        {headers, params}
    );

    const priceArray = response.data.output;
    const result = priceArray.stck_prpr;

    console.log("결과 :" ,result);

    return result;
}

// 3. 시장가 미국 거래
async function getStockPriceUs(code, marketType){
    const url = `${process.env.VTS_3}/uapi/overseas-price/v1/quotations/price`;
    const params = {
        AUTH: "",
        EXCD: marketType,
        SYMB: code
    };

    const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${process.env.VTS_TOKEN_3}`,
        'appkey': process.env.VTS_APPKEY_3,
        'appsecret': process.env.VTS_APPSECRET_3,
        'tr_id': 'HHDFS00000300',
    };

    const response = await axios.get(
        `${process.env.VTS_3}/uapi/domestic-stock/v1/quotations/inquire-ccnl`,
        {headers, params}
    );

    const result = Math.round(response.data.output.last*1391);

    return result;
}

// 4. 마이페이지 한국주식 가격
async function getMyPageKrStockPrice(code) {

    const headers={
        'content-type' : 'application/json; charset=utf-8',
        'authorization': `Bearer ${process.env.VTS_TOKEN_4}`,
        'appkey': process.env.VTS_APPKEY_4,
        'appsecret': process.env.VTS_APPSECRET_4,
        'tr_id': 'FHKST01010100'
    }

    const params = {
        'fid_cond_mrkt_div_code' : 'J',
        'fid_input_iscd' : code
    }

    const response = await axios.get(
        `${process.env.VTS_4}/uapi/domestic-stock/v1/quotations/inquire-price`,
        {headers, params}
    );

    const priceArray = response.data.output;
    const result = priceArray.stck_prpr;

    console.log("테스트 결과 :" ,result);

    return result;
}

// 5. 마이페이지 미국주식 가격
async function getMyPageUsStockPrice(code, marketType){
    const url = `${process.env.VTS_5}/uapi/overseas-price/v1/quotations/price`;
    const params = {
        AUTH: "",
        EXCD: marketType,
        SYMB: code
    };

    const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${process.env.VTS_TOKEN_5}`,
        'appkey': process.env.VTS_APPKEY_5,
        'appsecret': process.env.VTS_APPSECRET_5,
        'tr_id': 'HHDFS00000300',
    };

    const response = await axios.get(
        `${process.env.VTS_5}/uapi/domestic-stock/v1/quotations/inquire-ccnl`,
        {headers, params}
    );

    const result = Math.round(response.data.output.last*1391);

    return result;
}

module.exports = {getStockPriceRealTime, getStockPrice, getStockPriceUs, getMyPageKrStockPrice, getMyPageUsStockPrice};
