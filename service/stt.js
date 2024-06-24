const axios = require('axios');
const fs = require('fs');
const path = require('path');

const clientId = "30fg937zfd"; // Application Client ID
const clientSecret = "xMMrGYkclj68uCVSoKLQ1bivsfgw89ire1re2lwI"; // Application Client Secret

async function stt() {
    const imgFile = "/Users/shin-uijin/Desktop/스터디 자료/자소설 project/langchain/speech2.mp3";
    const language = "Kor"; // 언어 코드 (Kor, Jpn, Eng, Chn)
    const apiURL = `https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=${language}`;

    try {
        const voiceFile = fs.readFileSync(imgFile);

        const response = await axios.post(apiURL, voiceFile, {
            headers: {
                'Content-Type': 'application/octet-stream',
                'X-NCP-APIGW-API-KEY-ID': clientId,
                'X-NCP-APIGW-API-KEY': clientSecret
            }
        });

        console.log(response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error("Error: " + error.response.status);
            console.error(error.response.data);
        } else {
            console.error("Exception: " + error.message);
        }
        return null;
    }
}

// 사용 예시
stt().then(result => {
    if (result) {
        console.log("STT 결과:", result);
    } else {
        console.log("STT 실패");
    }
});