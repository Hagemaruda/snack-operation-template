import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: undefined,
};

export const app = initializeApp(firebaseConfig);
//export const db = getFirestore(app);
export const auth = getAuth(app);

// 💡 getFirestore(app) の代わりにこれを使う
export const db = initializeFirestore(app, {
  // 通信エラーを回避するため、実験的な設定を無効化し、安定した通信（Long Polling）を優先させる
  experimentalForceLongPolling: true, 
});