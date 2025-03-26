import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import dotenv from "dotenv";

// Firebase設定
dotenv.config();
const firebaseConfig = {
  apiKey: "AIzaSyDr6sA4NI87yC30Fk2O_ejZ93kqXztlDq0",
  authDomain:"tama-treaning.firebaseapp.com",
  projectId: "tama-treaning",
  storageBucket: "tama-treaning.firebasestorage.app",
  messagingSenderId: "876509994061",
  appId: "G-DJH5BPFJ4F"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ログイン処理
const loginUser = async (email, password) => {
  try {
    // ユーザーのメールアドレスとパスワードでサインイン
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // ユーザー情報を取得
    const user = userCredential.user;
    
    console.log("ユーザーが正常にログインしました:", user);
    return user;
  } catch (error) {
    console.error("ログインエラー:", error.message);
  }
};

// 例: ログインするユーザー情報を指定
loginUser("test1234@example.com", "password123");  // ここはテスト用のメールとパスワードを指定