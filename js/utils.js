// ===================================================
// utils.js — دوال مساعدة مشتركة
// ===================================================

import { auth } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ——— تسجيل الخروج ———
export async function logout() {
  await signOut(auth);
  window.location.href = "/pages/login.html";
}

// ——— Toast Notification ———
export function showToast(msg, type = "info", duration = 3000) {
  const colors = {
    info:    "#1c64f2",
    success: "#10b981",
    error:   "#ef4444",
    warning: "#f59e0b",
  };

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.style.background = colors[type] || colors.info;
  toast.textContent = msg;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity .3s";
    setTimeout(() => toast.remove(), 350);
  }, duration);
}

// ——— عداد التأخير ———
/**
 * يحسب عدد أيام التأخير من تاريخ ما حتى اليوم
 * ويعيد class المناسب للشارة
 */
export function delayBadge(dateString) {
  const start   = new Date(dateString);
  const now     = new Date();
  const diffMs  = now - start;
  const days    = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let cls   = "delay-1";
  let label = `${days} يوم`;

  if (days >= 14)     cls = "delay-4";
  else if (days >= 8) cls = "delay-3";
  else if (days >= 4) cls = "delay-2";

  return `<span class="delay-badge ${cls}">${label}</span>`;
}

// ——— حالة الطلب Badge ———
const STATUS_MAP = {
  pending:   { label: "بانتظار القبول",  cls: "badge-pending"   },
  accepted:  { label: "مقبول",           cls: "badge-active"    },
  in_progress:{ label: "قيد التنفيذ",   cls: "badge-active"    },
  done:      { label: "منجز",            cls: "badge-done"      },
  cancelled: { label: "ملغي",            cls: "badge-cancelled" },
  waiting_approval: { label: "انتظار موافقة", cls: "badge-pending" },
};

export function statusBadge(status) {
  const s = STATUS_MAP[status] || { label: status, cls: "" };
  return `<span class="badge ${s.cls}">${s.label}</span>`;
}

// ——— تنسيق التاريخ ———
export function formatDate(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("ar-SA", {
    year: "numeric", month: "short", day: "numeric"
  });
}

export function formatDateTime(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString("ar-SA", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

// ——— تحميل Cloudinary ———
const CLOUDINARY_URL  = "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload";
const CLOUDINARY_PRESET = "YOUR_UPLOAD_PRESET";   // unsigned preset

/**
 * يرفع صورة إلى Cloudinary ويعيد الـ URL الآمن
 * @param {File} file
 * @returns {Promise<string>} secure_url
 */
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_PRESET);

  const res  = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
  const data = await res.json();

  if (!res.ok) throw new Error(data.error?.message || "فشل رفع الصورة");
  return data.secure_url;
}

// ——— قراءة رقم العداد بشكل آمن ———
export function parseKm(val) {
  const n = parseInt(String(val).replace(/,/g, ""), 10);
  return isNaN(n) ? 0 : n;
}

// ——— بناء رقم طلب تلقائي ———
export function generateRequestId() {
  const d   = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `REQ-${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}-${Math.floor(Math.random()*9000+1000)}`;
}

// ——— تأكيد بسيط ———
export function confirm(msg) {
  return window.confirm(msg);
}

// ——— مودال ديناميكي ———
/**
 * يفتح مودالاً بسيطاً ويعيد Promise يُحلّ بـ true إذا تأكّد المستخدم.
 */
export function showConfirmModal(title, body) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal-box" style="max-width:380px">
        <div class="modal-title">${title}</div>
        <p style="color:var(--clr-text-2);font-size:.9rem;margin-bottom:0">${body}</p>
        <div class="modal-footer">
          <button class="btn btn-ghost" id="cm-cancel">إلغاء</button>
          <button class="btn btn-danger" id="cm-confirm">تأكيد</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    document.getElementById("cm-cancel").onclick  = () => { overlay.remove(); resolve(false); };
    document.getElementById("cm-confirm").onclick = () => { overlay.remove(); resolve(true);  };
  });
}
