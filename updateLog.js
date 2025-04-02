// updateLog.js
const { getTrainingLogs, updateTrainingLog } = require('./firestoreService');

const fetchAndUpdateLog = async () => {
  try {
    const logs = await getTrainingLogs();
    console.log('取得したログデータ:', logs);

    const logIdToUpdate = logs[0]?.id;  // 最初のログのIDを取得

    if (logIdToUpdate) {
      console.log('更新するログのID:', logIdToUpdate);

      const updatedData = {
        weight: 110  // 例えば、weightを更新する
      };

      // 更新処理
      await updateTrainingLog(logIdToUpdate, updatedData);
      console.log("ログが更新されました！");
    } else {
      console.log("更新するログIDが見つかりませんでした");
    }

  } catch (error) {
    console.error("エラー:", error);
  }
};

fetchAndUpdateLog();