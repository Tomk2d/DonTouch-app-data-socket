const axios = require('axios');
const crypto = require('crypto');

async function training() {


// 필요한 헤더 값들을 정의합니다.
    const api_gw_time = Date.now().toString();  // 현재 시간을 밀리초로 변환
    const iam_access_key = 'psJoqN1upmVbUDmi2Fo0';
    const secret_key = 'vDnzmRi0NPexqQtVO6qDa8tVLe8K1UmJzsc0NwkU';

// 서명 생성 함수
    function makeSignature(timestamp, accessKey, secretKey) {
        const space = " ";                // 공백
        const newLine = "\n";             // 줄바꿈
        const method = "POST";            // 요청 메서드
        const url = "/tuning/v2/tasks";   // 요청 URL
        const message = method + space + url + newLine + timestamp + newLine + accessKey;
        const hmac = crypto.createHmac('sha256', secretKey);
        return hmac.update(message).digest('base64');
    }

    const api_gw_sig = makeSignature(api_gw_time, iam_access_key, secret_key);

// POST 요청을 보낼 데이터 객체를 정의합니다.
    const data = {
        name: "generation_task",
        model: "HCX-003",
        taskType: "GENERATION",
        tuningType: "PEFT",
        trainEpochs: "8",
        learningRate: "1e-5f",
        trainingDatasetBucket: "clova-db",
        trainingDatasetFilePath: "1tier utf-8.csv",
        trainingDatasetAccessKey: iam_access_key,
        trainingDatasetSecretKey: secret_key
    };

// axios를 사용하여 POST 요청을 보냅니다.
    const result =await axios.post('https://clovastudio.apigw.ntruss.com/tuning/v2/tasks', data, {
        headers: {
            'Content-Type': 'application/json',
            'X-NCP-APIGW-TIMESTAMP': api_gw_time,
            'X-NCP-IAM-ACCESS-KEY': iam_access_key,
            'X-NCP-APIGW-SIGNATURE-V2': api_gw_sig
        }
    });
    console.log(result.data);
}

training();

exports.module = {training,};