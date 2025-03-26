import { saveTrainingLog } from "./src/services/saveTrainingLog.js";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// テストデータ
const testLog = {
    exerciseType: "ベンチプレス",
    sets: 4,
    reps: 8,
    weight: 100
};

// Firebase認証用
const auth = getAuth();

// ユーザー認証（既存のユーザーでサインイン）
const signInUser = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("ユーザー認証成功");

        // 認証後にトレーニングログを保存
        saveTrainingLog(testLog).catch((error) => console.error("テストエラー:", error));
    } catch (error) {
        console.error("認証エラー:", error.message);
    }
};

// サインインしてからトレーニングログを保存
signInUser("test@example.com", "password123");