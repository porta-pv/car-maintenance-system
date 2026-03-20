// ===================================================
// firebase.js — إعداد Firebase وتهيئة الخدمات
// ===================================================
// ضع بيانات مشروعك من Firebase Console هنا

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth }        from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore }   from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyBosByp3a-Fb8NS3CbUzgugHiuHOy-SNKc",
  authDomain:        "carmaintenance-33139.firebaseapp.com",
  projectId:         "carmaintenance-33139",
  storageBucket:     "carmaintenance-33139.firebasestorage.app",
  messagingSenderId: "185823091137",
  appId:             "1:185823091137:web:8ec72063ea04a2b0deb740"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);
