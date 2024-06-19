const axios = require("axios");
const path = require("path");
require("dotenv").config();

async function getStockPrice(code) {

    const headers={
        'content-type' : 'application/json; charset=utf-8',
        'authorization': `Bearer ${process.env.VTS_TOKEN}`,
        'appkey': process.env.VTS_APPKEY,
        'appsecret': process.env.VTS_APPSECRET,
        'tr_id': 'FHKST01010100'
    }

    const params = {
        'fid_cond_mrkt_div_code' : 'J',
        'fid_input_iscd' : code
    }

    const response = await axios.get(
        `${process.env.VTS}/uapi/domestic-stock/v1/quotations/inquire-price`,
        {headers, params}
    );

    const priceArray = response.data.output;
    const result = priceArray.stck_prpr;

    console.log("결과 :" ,result);

    return result;
}

module.exports = {getStockPrice};
