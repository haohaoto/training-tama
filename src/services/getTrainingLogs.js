import { db } from "../config/firebase.js";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

/**
 * ユーザーのトレーニングログを取得する
 * @returns {Promise<Array>} - 取得したトレーニングログの配列
 */
export async function getTrainingLogs() {
    try {
        const auth = getAuth();
        const user = auth.currentUser;  // 現在認証されているユーザーを取得

        if (!user) {
            throw new Error("ユーザーが認証されていません");
        }

        const userId = user.uid;  // 認証ユーザーのUIDを取得
        console.log("📢 Firestore からデータ取得開始...");
        console.log("🔍 userId フィルタ:", userId);

        const logsRef = collection(db, "trainingLogs");
        const q = query(logsRef, where("userId", "==", userId));  // userIdでフィルタリング

        const querySnapshot = await getDocs(q);
        const logs = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log("✅ 取得したトレーニングログ:", logs);
        return logs;
    } catch (error) {
        console.error("❌ エラー:", error.message);
        throw new Error("トレーニングログの取得に失敗しました");
    }
}