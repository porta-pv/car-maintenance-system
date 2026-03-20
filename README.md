# 🚗 نظام متابعة صيانة السيارات

نظام ويب متجاوب لمتابعة صيانة سيارات هيئة الأمر بالمعروف والنهي عن المنكر — منطقة جازان.

---

## 🏗️ هيكل الملفات

```
car-maintenance-system/
├── index.html                  ← نقطة الدخول (توجيه حسب الدور)
├── firestore.rules             ← قواعد أمان Firebase
├── README.md
│
├── pages/
│   ├── login.html              ← صفحة تسجيل الدخول
│   ├── owner.html              ← لوحة رئيس الهيئة
│   ├── tech.html               ← لوحة الفني
│   ├── admin.html              ← لوحة المدير
│   ├── it.html                 ← لوحة IT
│   └── developer.html          ← لوحة المطور (عرض فقط)
│
├── styles/
│   ├── main.css                ← نظام التصميم الأساسي
│   └── components.css          ← مكونات إضافية
│
└── js/
    ├── firebase.js             ← إعداد Firebase
    ├── router.js               ← التوجيه حسب الدور
    └── utils.js                ← دوال مساعدة مشتركة
```

---

## 🔑 الأدوار والصلاحيات

| الدور | الصفحة | الصلاحيات |
|-------|--------|-----------|
| **رئيس الهيئة** | owner.html | سياراته فقط، تسجيل عداد، طلب صيانة، تأكيد استلام + تقييم |
| **الفني** | tech.html | كل السيارات، لوحة يومية، تقرير + تكلفة، عداد تأخير |
| **المدير** | admin.html | إشرافي كامل، موافقة نقل ملكية، تقارير شاملة |
| **IT** | it.html | إدارة المستخدمين، نسخ احتياطي |
| **مطور** | developer.html | عرض فقط، يُنشئه IT |

---

## ⚙️ خطوات الإعداد

### 1. إنشاء مشروع Firebase

1. افتح [Firebase Console](https://console.firebase.google.com)
2. أنشئ مشروعاً جديداً
3. فعّل **Authentication** → Email/Password
4. فعّل **Firestore Database** (ابدأ في وضع Test ثم طبّق الـ Rules)

### 2. إعداد `js/firebase.js`

افتح الملف وضع بيانات مشروعك:

```js
const firebaseConfig = {
  apiKey:            "...",
  authDomain:        "...",
  projectId:         "...",
  storageBucket:     "...",
  messagingSenderId: "...",
  appId:             "..."
};
```

تجد هذه البيانات في:
**Firebase Console → Project Settings → Your apps → Config**

### 3. تطبيق قواعد الأمان

انسخ محتوى `firestore.rules` إلى:
**Firestore → Rules → تحرير → نشر**

### 4. إعداد Cloudinary

في `js/utils.js` عدّل:

```js
const CLOUDINARY_URL    = "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload";
const CLOUDINARY_PRESET = "YOUR_UPLOAD_PRESET";
```

أنشئ **Unsigned Upload Preset** من:
**Cloudinary Console → Settings → Upload → Upload presets**

### 5. إنشاء أول مستخدم (IT)

في Firebase Console → Authentication → Users → Add User

ثم في Firestore → users → Add Document بـ uid المستخدم:

```json
{
  "uid":    "USER_UID_FROM_AUTH",
  "email":  "it@example.com",
  "name":   "اسم مسؤول IT",
  "role":   "it",
  "frozen": false,
  "createdAt": "timestamp"
}
```

### 6. النشر على GitHub Pages

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

ثم في GitHub → Settings → Pages → Source: **main branch / root**

---

## 🎨 التصميم

- **اتجاه**: RTL عربي
- **النمط**: أبيض نظيف — بطاقات بيضاء، ألوان دلالية للحالات
- **جوال أولاً**: شريط تنقل سفلي على الجوال، شريط جانبي على الشاشات الكبيرة

### ألوان الحالات

| الحالة | اللون |
|--------|-------|
| بانتظار القبول | 🟡 أصفر |
| قيد التنفيذ | 🔵 أزرق |
| منجز | 🟢 أخضر |
| ملغي | 🔴 أحمر |

### عداد التأخير

| الأيام | اللون |
|--------|-------|
| 1–3 | 🟢 أخضر |
| 4–7 | 🟡 أصفر |
| 8–14 | 🟠 برتقالي |
| +14 | 🔴 أحمر |

---

## 📋 Collections في Firestore

```
users/          ← بيانات المستخدمين والأدوار
vehicles/       ← السيارات وأصحابها وقراءات العداد
requests/       ← طلبات الصيانة وحالاتها
reports/        ← تقارير الفني والتكلفة
notifications/  ← الإشعارات والتنبيهات
```

---

## 🔔 التنبيهات التلقائية

- كل **5,000 كم** → تذكير بتغيير الزيت
- كل **10,000 كم** → فحص دوري
- **أسبوعياً** → تذكير بتحديث العداد إذا لم يُسجَّل

---

*صُمِّم لهيئة الأمر بالمعروف والنهي عن المنكر — فرع منطقة جازان*
