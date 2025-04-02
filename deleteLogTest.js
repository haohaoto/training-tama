// firestoreService.js から必要な関数をインポート
const { getTrainingLogs, deleteTrainingLog } = require('./firestoreService');

// トレーニングログを取得し、削除を実行する関数
const fetchAndDeleteLog = async () => {
  try {
    // Firestoreから全てのトレーニングログを取得
    const logs = await getTrainingLogs();
    
    // 取得したログデータを表示
    console.log('取得したログデータ:', logs);

    // 削除したいログのIDを決めます
    const logIdToDelete = logs[0]?.id;  // 最初のログのIDを取得（undefinedチェックを追加）

    if (logIdToDelete) {
      console.log('削除するログのID:', logIdToDelete);

      // そのIDを使って削除
      await deleteTrainingLog(logIdToDelete);
      console.log("ログが削除されました！");
    } else {
      console.log("削除するログIDが見つかりませんでした");
    }

  } catch (error) {
    console.error("エラー:", error);
  }
};

// 実行
fetchAndDeleteLog();