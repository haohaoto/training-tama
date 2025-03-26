import { getTrainingLogs } from "./src/services/getTrainingLogs.js";

// テスト実行
getTrainingLogs().then(logs => {
    console.log("ログ取得結果:", logs);
}).catch(error => {
    console.error("テストエラー:", error.message);
});