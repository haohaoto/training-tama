// LoginForm.js
import { getIdToken } from 'firebase/auth';

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    await signInWithEmailAndPassword(auth, email, password);
    const token = await getIdToken(auth.currentUser);
    
    // トークンをAPIに送信
    const response = await fetch('/api/protected', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    const data = await response.json();
    alert(data.message);
  } catch (err) {
    setError('ログインに失敗しました。');
    console.error(err.message);
  }
};