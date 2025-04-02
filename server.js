const express = require("express");
const cors = require("cors");
const path = require("path");
const admin = require("firebase-admin");

const app = express();
app.use(cors());
app.use(express.json());

// Firebase初期化
const serviceAccount = require(path.join(__dirname, "../config/serviceAccountKey.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tama-treaning.firebaseio.com"
});

const db = admin.firestore();

// 正しいpublicフォルダへのパスを指定
const publicPath = path.join(__dirname, "../../public");
app.use(express.static(publicPath));

// ルート（/）にアクセスがあった場合に、index.html を返す
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// トレーニングログ取得
app.get("/logs", async (req, res) => {
  const user = req.headers["user-id"]; // ヘッダーに含めたユーザーIDを取得

  if (!user) {
    return res.status(400).send("ユーザーIDが必要です。");
  }

  try {
    const logsSnapshot = await db.collection("trainingLogs")
      .where("userId", "==", user)  // ユーザーIDでフィルタリング
      .get();

    const logs = logsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).send("Internal Server Error");
  }
});

// トレーニングログ追加
app.post("/logs", async (req, res) => {
  const { exerciseType, weight, sets, reps, userId } = req.body;
  const trainingDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD 形式

  try {
    const newLogRef = await db.collection("trainingLogs").add({
      exerciseType,
      weight: Number(weight),
      sets: Number(sets),
      reps: Number(reps),
      userId,
      training_date: trainingDate,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.status(201).json({ id: newLogRef.id, exerciseType, weight, sets, reps });
  } catch (error) {
    console.error("Error adding log:", error);
    res.status(500).send("Internal Server Error");
  }
});

// トレーニングログ削除
app.delete("/logs/:id", async (req, res) => {
  const logId = req.params.id;
  try {
    await db.collection("trainingLogs").doc(logId).delete();
    res.status(200).send("ログ削除成功");
  } catch (error) {
    console.error("Error deleting log:", error);
    res.status(500).send("Internal Server Error");
  }
});

// トレーニングログ更新
app.patch("/logs/:id", async (req, res) => {
  const logId = req.params.id;
  const { exerciseType, weight, sets, reps } = req.body;

  try {
    const docRef = db.collection("trainingLogs").doc(logId);
    await docRef.update({
      exerciseType,
      weight: Number(weight),
      sets: Number(sets),
      reps: Number(reps),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({ message: "ログ更新成功" });
  } catch (error) {
    console.error("Error updating log:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => console.log("🚀 サーバー起動: http://localhost:3000"));