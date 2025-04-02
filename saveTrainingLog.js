import { getAuth } from "firebase/auth";
import { db } from "../config/firebase.js";
import { collection, addDoc } from "firebase/firestore";

/**
 * トレーニングログをFirestoreに保存する
 * @param {Object} logData - 保存するトレーニングログのデータ
 * @param {string} logData.exerciseType - 種目
 * @param {number} logData.sets - セット数
 * @param {number} logData.reps - レップ数
 * @param {number} logData.weight - 重量
 * @returns {Promise<void>} - トレーニングログが保存される
 */
export async function saveTrainingLog(logData) {
    try {
        const auth = getAuth();  // Firebase Authentication を取得
        const user = auth.currentUser;  // 現在認証されているユーザーを取得

        if (!user) {
            throw new Error("ユーザーが認証されていません");
        }

        // ログデータにユーザーIDを追加
        const logWithUserId = {
            ...logData,
            userId: user.uid,  // 認証されたユーザーのIDを追加
            createdAt: new Date()  // ログ作成日時
        };

        // FirestoreのtrainingLogsコレクションにデータを追加
        const logsRef = collection(db, "trainingLogs");
        await addDoc(logsRef, logWithUserId);

        console.log("✅ トレーニングログが保存されました:", logWithUserId);
    } catch (error) {
        console.error("❌ エラー:", error.message);
        throw new Error("トレーニングログの保存に失敗しました");
    }
}