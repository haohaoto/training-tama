const admin = require('firebase-admin');
const path = require('path');

// Firebase Admin SDKの初期化
const serviceAccount = require(path.join(__dirname, '../config/serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();  // Firestoreインスタンスを取得

// トレーニングログを追加
const addTrainingLog = async (logData) => {
  try {
    // データのマッピング
    const mappedData = {
      userId: logData.user_id,  // user_id を userId にマッピング
      exerciseType: logData.exercises[0],  // exercises の最初を exerciseType にマッピング
      sets: logData.sets,
      reps: logData.reps,
      weight: logData.weights[0],  // weights の最初を weight にマッピング
      createdAt: new Date().toISOString(),
    };

    await db.collection('trainingLogs').add(mappedData);
    console.log('Training log added successfully');
  } catch (error) {
    console.error('Error adding training log:', error);
  }
};

// トレーニングログを取得
const getTrainingLogs = async () => {
  try {
    const snapshot = await db.collection('trainingLogs').get();
    const logs = snapshot.docs.map(doc => ({
      id: doc.id, // ドキュメントIDを追加
      ...doc.data() // 他のデータをマージ
    }));
    console.log('取得したログデータ:', logs); // ログデータを表示
    return logs;
  } catch (error) {
    console.error('Error getting training logs:', error);
    throw error;
  }
};

// トレーニングログを更新
const updateTrainingLog = async (id, updatedData) => {
  try {
    const docRef = db.collection('trainingLogs').doc(id);
    await docRef.update(updatedData);
    console.log('Training log updated successfully');
  } catch (error) {
    console.error('Error updating training log:', error);
    throw error;
  }
};

// トレーニングログを削除（userId と exerciseType に基づいて削除）
const deleteTrainingLog = async (id) => {
  try {
    const docRef = db.collection('trainingLogs').doc(id);
    await docRef.delete();
    console.log(`Deleted log with ID: ${id}`);
  } catch (error) {
    console.error('Error deleting training log:', error);
    throw error;
  }
};

module.exports = { addTrainingLog, getTrainingLogs, updateTrainingLog, deleteTrainingLog };