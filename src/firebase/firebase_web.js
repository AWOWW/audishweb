import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCLxPmW9IGQLm1SuvHxOdZBcKL7LzC5W0E",
  authDomain: "audish-0430.firebaseapp.com",
  databaseURL:
    "https://audish-0430-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "audish-0430",
  storageBucket: "audish-0430.appspot.com",
  messagingSenderId: "831280846698",
  appId: "1:831280846698:web:e534d0e03e830a9264f713",
  measurementId: "G-PFJ1C5F84H",
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firestore와 Storage 초기화
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
