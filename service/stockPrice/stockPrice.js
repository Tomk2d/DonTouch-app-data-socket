const axios = require("axios");
const path = require("path");
require("dotenv").config();

async function getStockPrice(code) {

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

async function getStockPriceUs(code, marketType){
    const url = `${process.env.VTS_2}/uapi/overseas-price/v1/quotations/price`;
    const params = {
        AUTH: "",
        EXCD: marketType,
        SYMB: code
    };

    const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${process.env.VTS_TOKEN_2}`,
        'appkey': process.env.VTS_APPKEY_2,
        'appsecret': process.env.VTS_APPSECRET_2,
        'tr_id': 'HHDFS00000300',
    };

    const response = await axios.get(
        `${process.env.VTS_2}/uapi/domestic-stock/v1/quotations/inquire-ccnl`,
        {headers, params}
    );

    const result = Math.round(response.data.output.last*1391);

    return result;
}

module.exports = {getStockPrice, getStockPriceUs};
