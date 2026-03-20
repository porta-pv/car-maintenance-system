// ===================================================
// router.js — التحقق من الجلسة وتوجيه الأدوار
// ===================================================

import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc }        from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// خريطة الأدوار → الصفحات
const ROLE_PAGES = {
  owner:     "/pages/owner.html",
  tech:      "/pages/tech.html",
  manager:   "/pages/admin.html",
  it:        "/pages/it.html",
  developer: "/pages/developer.html",
};

// الصفحات العامة التي لا تحتاج تسجيل دخول
const PUBLIC_PAGES = ["/pages/login.html", "/index.html", "/"];

/**
 * يُشغَّل في index.html ويراقب حالة المصادقة.
 * إذا كان المستخدم مسجلاً → يجلب دوره ويوجّهه.
 * إذا لم يكن مسجلاً → يوجّهه لصفحة الدخول.
 */
export function initRouter() {
  onAuthStateChanged(auth, async (user) => {
    const path = window.location.pathname;

    if (!user) {
      // غير مسجل → أرسله للدخول إن لم يكن عليها
      if (!PUBLIC_PAGES.some(p => path.endsWith(p))) {
        window.location.href = "/pages/login.html";
      }
      return;
    }

    // مسجل → جلب بيانات المستخدم من Firestore
    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists()) {
        console.error("المستخدم غير موجود في قاعدة البيانات");
        await auth.signOut();
        window.location.href = "/pages/login.html";
        return;
      }

      const data = snap.data();

      // حساب مجمّد → خروج فوري
      if (data.frozen) {
        await auth.signOut();
        window.location.href = "/pages/login.html?reason=frozen";
        return;
      }

      const targetPage = ROLE_PAGES[data.role];
      if (!targetPage) {
        console.error("دور غير معروف:", data.role);
        return;
      }

      // إذا لم يكن على الصفحة الصحيحة → وجّهه
      if (!path.endsWith(targetPage)) {
        window.location.href = targetPage;
      }
    } catch (err) {
      console.error("خطأ في جلب بيانات المستخدم:", err);
    }
  });
}

/**
 * يُستخدم في كل صفحة دور للتحقق من أن المستخدم الحالي
 * يملك الدور المطلوب فعلاً.
 * @param {string} requiredRole - الدور المتوقع لهذه الصفحة
 * @returns {Promise<{user, userData}>}
 */
export async function requireRole(requiredRole) {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (!user) {
        window.location.href = "/pages/login.html";
        return reject("no_user");
      }

      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (!snap.exists()) {
          window.location.href = "/pages/login.html";
          return reject("no_doc");
        }

        const userData = snap.data();

        if (userData.frozen) {
          await auth.signOut();
          window.location.href = "/pages/login.html?reason=frozen";
          return reject("frozen");
        }

        if (userData.role !== requiredRole) {
          // الدور خاطئ → وجّهه لصفحته الصحيحة
          const correct = ROLE_PAGES[userData.role];
          if (correct) window.location.href = correct;
          return reject("wrong_role");
        }

        resolve({ user, userData });
      } catch (err) {
        reject(err);
      }
    });
  });
}
