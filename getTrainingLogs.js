// src/services/getTrainingLogs.js
import { db } from "../config/firebase.js"; // Firebaseの設定をインポート
import { getDocs, collection, query, where } from "firebase/firestore";
import { getAuth } from "firebase-admin/auth"; // Firebase Admin SDKをインポート

// トレーニングログを取得する関数
export async function getAllTrainingLogs(authHeader) {
    try {
        // Authorization ヘッダーからトークンを取得
        const token = authHeader.split(" ")[1];  // "Bearer <token>" 形式を想定
        if (!token) {
            throw new Error("トークンがありません");
        }

        // Firebase Admin SDK を使ってトークンを検証
        const decodedToken = await getAuth().verifyIdToken(token);
        console.log("✅ トークンが確認されました:", decodedToken);

        // トークンが有効なら、Firestore からデータを取得
        const userId = decodedToken.uid;  // UIDを取得
        const logsRef = collection(db, "trainingLogs");
        const q = query(logsRef, where("userId", "==", userId)); // userIdでフィルタリング

        const querySnapshot = await getDocs(q);
        const logs = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return logs;
    } catch (error) {
        console.error("❌ エラー:", error.message);
        throw new Error("トレーニングログの取得に失敗しました");
    }
}