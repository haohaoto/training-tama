import { getAllTrainingLogs } from "./src/services/getTrainingLogs.js";

// 全データを取得して確認
const fetchLogs = async () => {
  try {
    const logs = await getAllTrainingLogs();
    console.log("📋 取得結果:", logs);
  } catch (error) {
    console.error("❌ テストエラー:", error.message);
  }
};

fetchLogs();