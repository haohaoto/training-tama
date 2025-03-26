// server.js (バックエンド)
const express = require('express');
const admin = require('firebase-admin');

admin.initializeApp();

const app = express();

app.use(express.json());

app.post('/api/protected', async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(403).send('Authorization token required');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    // ユーザーIDや情報を使ってデータを取得
    res.status(200).send({ message: '認証成功', userId: decodedToken.uid });
  } catch (error) {
    res.status(403).send('無効なトークン');
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});