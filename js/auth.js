// ============================================================
//  auth.js — المصادقة والتوجيه حسب الدور
// ============================================================

import { auth, db } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ---- خريطة الأدوار ← الصفحات ----
const ROLE_ROUTES = {
  president:  "/pages/president.html",
  technician: "/pages/technician.html",
  manager:    "/pages/manager.html",
  it:         "/pages/manager.html",   // IT يستخدم واجهة المدير مع قسم إضافي
  developer:  "/pages/manager.html"    // عرض فقط
};

// ---- تسجيل الدخول ----
export async function login(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const role = await getUserRole(cred.user.uid);
  return { user: cred.user, role };
}

// ---- تسجيل الخروج ----
export async function logout() {
  await signOut(auth);
  window.location.href = "/index.html";
}

// ---- جلب الدور من Firestore ----
export async function getUserRole(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) throw new Error("المستخدم غير موجود في النظام");
  const data = snap.data();
  if (data.frozen) throw new Error("الحساب مجمّد. تواصل مع مدير النظام.");
  return data.role;
}

// ---- توجيه بعد الدخول ----
export function routeByRole(role) {
  const path = ROLE_ROUTES[role];
  if (!path) throw new Error("دور غير معروف: " + role);
  window.location.href = path;
}

// ---- حارس الصفحات: يمنع الوصول بدون تسجيل دخول ----
//  استخدمه في أول سطر من كل صفحة محمية:
//  import { requireAuth } from "../js/auth.js";
//  requireAuth(["president"]);  // قائمة الأدوار المسموح بها
export function requireAuth(allowedRoles = []) {
  return new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      unsub();
      if (!user) {
        window.location.href = "/index.html";
        return reject("غير مسجل");
      }
      try {
        const role = await getUserRole(user.uid);
        if (allowedRoles.length && !allowedRoles.includes(role)) {
          window.location.href = "/index.html";
          return reject("غير مصرح");
        }
        resolve({ user, role });
      } catch (e) {
        window.location.href = "/index.html";
        reject(e);
      }
    });
  });
}
