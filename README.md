# 🚗 نظام متابعة صيانة السيارات
### الإصدار 1.0.1

تطبيق ويب متجاوب لمتابعة صيانة سيارات هيئة الأمر بالمعروف والنهي عن المنكر — منطقة جازان.

**الرابط الحي:**
https://porta-pv.github.io/car-maintenance-system/

---

## هيكل الملفات

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

## الأدوار والصلاحيات

| الدور | الصفحة | الصلاحيات |
|-------|--------|-----------|
| **رئيس الهيئة** | owner.html | سياراته فقط، تسجيل عداد، طلب صيانة، تأكيد استلام + تقييم |
| **الفني** | tech.html | كل السيارات، لوحة يومية، تقرير + تكلفة، عداد تأخير |
| **المدير** | admin.html | إشرافي كامل، موافقة نقل ملكية، تقارير شاملة |
| **IT** | it.html | إدارة المستخدمين، نسخ احتياطي، حالة النظام |
| **مطور** | developer.html | عرض فقط، يُنشئه IT |

---

## نظام تسجيل الدخول

النظام يعتمد **اسم المستخدم + كلمة المرور** بدلاً من البريد الإلكتروني.

### آلية العمل
- IT يُدخل اسم مستخدم مثل `tech01`
- يُنشأ البريد تلقائياً: `tech01@pv.local`
- المستخدم يدخل فقط اسم المستخدم وكلمة المرور

### قواعد اسم المستخدم
- أحرف إنجليزية صغيرة وأرقام فقط
- لا مسافات ولا رموز خاصة
- مثال صحيح: `tech01` ، `owner2` ، `manager`
- مثال خاطئ: `Tech 01` ، `مستخدم`

---

## خطوة 1 — إنشاء مشروع Firebase

1. افتح https://console.firebase.google.com
2. سجّل دخولك بحساب Google
3. اضغط **Create a project**
4. أدخل اسم المشروع: `CARmaintenance`
5. اضغط **Continue**
6. أوقف تشغيل **Google Analytics**
7. اضغط **Create project**
8. انتظر حتى تظهر رسالة **Your new project is ready**
9. اضغط **Continue**

---

## خطوة 2 — تفعيل Authentication

1. في القائمة اليسرى اضغط **Authentication**
2. اضغط **Get started**
3. اضغط على **Email/Password**
4. فعّل الخيار الأول **Email/Password** ← اضغط التبديل حتى يصبح أزرق
5. اترك الخيار الثاني **Email link** معطّلاً
6. اضغط **Save**

✅ يجب أن يظهر: `Email/Password — Enabled`

---

## خطوة 3 — إنشاء Firestore Database

1. في القائمة اليسرى اضغط **Databases & Storage** ← ثم **Firestore**
2. اضغط **Create database**
3. اختر **Standard edition** ← اضغط **Next**
4. في حقل **Database ID** اتركه **(default)**
5. في حقل **Location** اختر: `me-west1 (Dammam)`
6. اضغط **Next**
7. اختر **Start in production mode**
8. اضغط **Create**

✅ يجب أن تظهر: `Your database is ready to go. Just add data.`

---

## خطوة 4 — تطبيق قواعد الأمان

1. في صفحة Firestore اضغط تبويب **Rules**
2. احذف كل المحتوى الموجود
3. الصق محتوى ملف `firestore.rules` من المشروع
4. اضغط **Publish**

> ⚠️ ملاحظة: خلال مرحلة التطوير والاختبار استخدم القواعد المبسّطة التالية، ثم عُد للقواعد الكاملة عند الإنتاج:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## خطوة 5 — ربط التطبيق بـ Firebase

1. افتح **Project Overview**
2. اضغط أيقونة **`</>`** لإضافة تطبيق ويب
3. في حقل **App nickname** أدخل: `car-maintenance-web`
4. اضغط **Register app**
5. ستظهر بيانات `firebaseConfig` — انسخها
6. افتح ملف `js/firebase.js` في المشروع
7. ضع البيانات في المكان المخصص:

```javascript
const firebaseConfig = {
  apiKey:            "...",
  authDomain:        "...",
  projectId:         "...",
  storageBucket:     "...",
  messagingSenderId: "...",
  appId:             "..."
};
```

8. اضغط **Continue to console**

---

## خطوة 6 — النشر على GitHub Pages

1. افتح https://github.com/new
2. في **Repository name** أدخل: `car-maintenance-system`
3. اختر **Public**
4. اضغط **Create repository**
5. اضغط **Upload files** أو **uploading an existing file**
6. افك ضغط ملف ZIP المشروع
7. اسحب محتوى مجلد `car-maintenance` كاملاً (وليس المجلد نفسه)
8. اضغط **Commit changes**
9. افتح **Settings** ← **Pages**
10. في **Branch** اختر `main` والمجلد `/ (root)`
11. اضغط **Save**

✅ سيظهر الرابط: `https://USERNAME.github.io/car-maintenance-system`

---

## خطوة 7 — إضافة الدومين في Firebase

1. افتح Firebase Console ← **Authentication** ← تبويب **Settings**
2. انزل لقسم **Authorized domains**
3. اضغط **Add domain**
4. أدخل: `USERNAME.github.io`
5. اضغط **Add**

> ⚠️ هذه الخطوة ضرورية — Firebase يرفض الطلبات من مواقع غير مسجّلة.

---

## خطوة 8 — إنشاء أول مستخدم IT

### أولاً — إنشاء الحساب في Authentication

1. افتح **Authentication** ← تبويب **Users**
2. اضغط **Add user**
3. أدخل:
   - Email: `it@pv.local`
   - Password: كلمة مرور قوية
4. اضغط **Add user**
5. انسخ الـ **UID** من قائمة المستخدمين

### ثانياً — تسجيله في Firestore

1. افتح **Firestore** ← اضغط **+ Start collection**
2. في **Collection ID** أدخل: `users`
3. اضغط **Next**
4. في حقل **Document ID** الصق الـ UID **(مهم جداً)**
5. أضف الحقول التالية:

| Field | Type | Value |
|-------|------|-------|
| `uid` | string | (الـ UID نفسه) |
| `name` | string | اسم المستخدم |
| `username` | string | `it` |
| `email` | string | `it@pv.local` |
| `role` | string | `it` |
| `frozen` | boolean | `false` |

6. اضغط **Save**

> ⚠️ **مهم جداً:** الـ Document ID يجب أن يكون نفس الـ UID — أي اختلاف يمنع تسجيل الدخول.

---

## إنشاء مستخدمين جدد (من لوحة IT)

1. سجّل دخولك بحساب IT
2. افتح **إضافة مستخدم**
3. أدخل:
   - الاسم الكامل
   - اسم المستخدم (أحرف إنجليزية وأرقام فقط، مثال: `tech01`)
   - كلمة المرور المؤقتة
   - الدور
4. اضغط **إنشاء الحساب**

سيُنشأ البريد تلقائياً: `tech01@pv.local`

> ⚠️ احتفظ باسم المستخدم وكلمة المرور وسلّمها للموظف بشكل آمن.

---

## Collections في Firestore

| Collection | الوصف | الحقول الرئيسية |
|------------|-------|----------------|
| `users` | المستخدمون والأدوار | uid, username, name, email, role, frozen |
| `vehicles` | السيارات | plate, make, model, ownerId, currentKm |
| `requests` | طلبات الصيانة | vehicleId, ownerId, status, maintenanceType |
| `reports` | تقارير الفني | requestId, techId, cost, techReport |
| `notifications` | الإشعارات | userId, type, read |
| `systemLogs` | سجل عمليات IT | type, description, performedBy |
| `backups` | سجل النسخ الاحتياطية | collections, recordCount, createdAt |

---

## التنبيهات التلقائية

| الحدث | الشرط | الإجراء |
|-------|-------|---------|
| تغيير الزيت | كل 5,000 كم | تنبيه لرئيس الهيئة والمدير |
| فحص دوري | كل 10,000 كم | تنبيه لرئيس الهيئة والمدير |
| تحديث العداد | لم يُسجَّل منذ أسبوع | تذكير أسبوعي لرئيس الهيئة |

---

## عداد التأخير

| الأيام | اللون |
|--------|-------|
| 1 – 3 | 🟢 أخضر |
| 4 – 7 | 🟡 أصفر |
| 8 – 14 | 🟠 برتقالي |
| +14 | 🔴 أحمر |

---

## التقنيات المستخدمة

| التقنية | الاستخدام |
|---------|-----------|
| HTML / CSS / JS | واجهة المستخدم |
| Firebase Authentication | تسجيل الدخول (اسم مستخدم + كلمة مرور) |
| Cloud Firestore | قاعدة البيانات — الدمام 🇸🇦 |
| GitHub Pages | الاستضافة المجانية |
| Cloudinary | رفع وضغط الصور |

---

## سجل الإصدارات

### v1.0.1
- تغيير نظام الدخول من البريد الإلكتروني إلى اسم المستخدم
- البريد يُنشأ تلقائياً بصيغة `username@pv.local`
- إصلاح إنشاء المستخدمين من لوحة IT بدون تغيير الجلسة
- إصلاح Document ID في Firestore ليكون نفس UID

### v1.0.0
- إطلاق النظام الأولي
- 6 لوحات: رئيس الهيئة، فني، مدير، IT، مطور، تسجيل دخول
- Firebase Auth + Firestore في الدمام
- قواعد أمان صارمة حسب الأدوار
- نشر على GitHub Pages

---

*الإصدار 1.0.1 — نظام متابعة صيانة السيارات*
*هيئة الأمر بالمعروف والنهي عن المنكر — فرع منطقة جازان*
