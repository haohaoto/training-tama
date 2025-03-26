const admin = require('firebase-admin');
const dotenv = require('dotenv');

// Firebase Admin SDKの初期化
dotenv.config();
admin.initializeApp({
  credential: admin.credential.applicationDefault(),  // サービスアカウントのJSONを使う場合
  databaseURL: 'https://your-database-name.firebaseio.com',  // 必要に応じて追加
});

// 認証ミドルウェア
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];  // トークンの取り出し

  if (!token) {
    return res.status(403).send('トークンが必要です');
  }

  admin.auth().verifyIdToken(token)
    .then(decodedToken => {
      req.user = decodedToken;
      next();
    })
    .catch(error => {
      res.status(401).send('無効なトークンです');
    });
};

module.exports = (req, res) => {
  // 認証されたユーザーのみがアクセスできるエンドポイント
  if (req.url === '/protected') {
    authenticateUser(req, res, () => {
      res.status(200).send(`認証されたユーザー: ${req.user.email}`);
    });
  } else {
    // 通常のエンドポイント
    res.status(200).send("Hello, this is my API running on Vercel!");
  }
};