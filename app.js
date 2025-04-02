console.log("🚀 Starting the server..."); // 追加

const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const Joi = require('joi');
const {
  addTrainingLog,
  getTrainingLogs,
  updateTrainingLog,
  deleteTrainingLog,
} = require('./firestoreService');

const path = require('path');
const app = express();
const port = 4000;

console.log("✅ Express app initialized"); // 追加

// CORS設定
app.use(cors({ origin: '*' }));
app.use(express.json());

// **✅ 静的ファイルを提供する設定（追加）**
app.use(express.static(path.join(__dirname, '../../public')));

// **✅ ルートアクセス時に `index.html` を返す**
app.get('/', (req, res) => {
  console.log("🏠 Root endpoint hit"); // 追加
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Joi バリデーションスキーマ
const trainingLogSchema = Joi.object({
  user_id: Joi.string().required(),
  training_date: Joi.string().required(),
  exercises: Joi.array().items(Joi.string().required()).min(1).required(),
  weights: Joi.array().items(Joi.number().required()).min(1).required(),
  sets: Joi.array().items(Joi.number().required()).min(1).required(),
  reps: Joi.array().items(Joi.number().required()).min(1).required(),
  max_weight: Joi.number().required(),
});

// POST /api/training-logs（追加）
app.post('/api/training-logs', async (req, res) => {
  try {
    // Joiバリデーション
    const { error } = trainingLogSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { user_id, training_date, exercises, weights, sets, reps, max_weight } = req.body;

    const trainingLog = {
      user_id,
      training_date,
      exercises,
      weights,
      sets,
      reps,
      max_weight,
      created_at: new Date().toISOString(),
    };

    const docId = await addTrainingLog(trainingLog);
    res.status(201).json({ message: 'Training log added', docId });
  } catch (error) {
    res.status(500).json({ message: 'Error adding training log', error: error.message });
  }
});

// GET /api/training-logs（取得）
app.get('/api/training-logs', async (req, res) => {
  try {
    const trainingLogs = await getTrainingLogs();
    if (trainingLogs.length === 0) {
      return res.status(404).json({ message: 'No training logs found' });
    }
    res.status(200).json(trainingLogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching training logs', error: error.message });
  }
});

// PUT /api/training-logs/:id（更新）
app.put('/api/training-logs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { exercises, weights, sets, reps, max_weight } = req.body;

    // Joiバリデーション
    const { error } = trainingLogSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const updatedLog = {
      exercises,
      weights,
      sets,
      reps,
      max_weight,
      updated_at: new Date().toISOString(),
    };

    await updateTrainingLog(id, updatedLog);
    res.status(200).json({ message: 'Training log updated', id });
  } catch (error) {
    res.status(500).json({ message: 'Error updating training log', error: error.message });
  }
});

// DELETE /api/training-logs/:id（削除）
app.delete('/api/training-logs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteTrainingLog(id);
    res.status(200).json({ message: 'Training log deleted', id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting training log', error: error.message });
  }
});

// Vercel 用エクスポート
module.exports.handler = serverless(app);

// ローカル実行時にサーバー起動
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}