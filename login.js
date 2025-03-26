import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";  // Firestore 関連を追加
import dotenv from "dotenv";

dotenv.config();

// Firebase の設定
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Firebase 初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Firestore 初期化

// テスト用のログイン情報
const email = "test@example.com";  // 事前に登録したメール
const password = "password123";  // 事前に登録したパスワード

// ログイン処理
signInWithEmailAndPassword(auth, email, password)
  .then(async (userCredential) => {
    const user = userCredential.user;
    console.log("✅ ログイン成功:", user);

    // Firestore にユーザー情報を保存
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      lastLogin: new Date(),
    });
    console.log("✅ ユーザーデータが Firestore に保存されました");
  })
  .catch((error) => {
    console.error("❌ ログイン失敗:", error.message);
  });