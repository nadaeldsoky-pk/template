# 🚀 CyberMode Dashboard - Vue.js + Vuetify + Tailwind CSS

<div align="center">
  <img src="public/logo.png" alt="CyberMode Logo" width="200"/>
  
  ### نظام إدارة الحوكمة والمخاطر والامتثال (GRC)
  
  [![Vue.js](https://img.shields.io/badge/Vue.js-3.4-4FC08D?logo=vue.js)](https://vuejs.org/)
  [![Vuetify](https://img.shields.io/badge/Vuetify-3.5-1867C0?logo=vuetify)](https://vuetifyjs.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
</div>

---

## 📋 جدول المحتويات

- [نظرة عامة](#-نظرة-عامة)
- [المميزات](#-المميزات)
- [متطلبات التشغيل](#-متطلبات-التشغيل)
- [التثبيت](#-التثبيت)
- [هيكل المشروع](#-هيكل-المشروع)
- [الاستخدام](#-الاستخدام)
- [المكونات](#-المكونات)
- [التخصيص](#-التخصيص)
- [البناء للإنتاج](#-البناء-للإنتاج)

---

## 🎯 نظرة عامة

**CyberMode Dashboard** هو تطبيق ويب احترافي متكامل لإدارة الحوكمة والمخاطر والامتثال (GRC). تم بناؤه باستخدام أحدث تقنيات الويب مع دعم كامل للغة العربية واتجاه RTL.

## ✨ المميزات

### التصميم والواجهة
- ✅ **تصميم احترافي** - متطابق بالكامل مع المواصفات
- ✅ **دعم RTL كامل** - واجهة عربية 100%
- ✅ **متجاوب تماماً** - يعمل على جميع الأحجام
- ✅ **رسوم متحركة سلسة** - تجربة مستخدم ممتازة

### التقنيات
- ⚡ **Vue 3** - Composition API
- 🎨 **Vuetify 3** - مكونات جاهزة
- 🌊 **Tailwind CSS** - تخصيص سريع
- 🗺️ **Vue Router** - توجيه الصفحات
- 📦 **Pinia** - إدارة الحالة
- ⚡ **Vite** - بناء سريع

### الوظائف
- 🔐 نظام مصادقة كامل
- 📊 لوحة تحكم تفاعلية
- 📈 إحصائيات وتحليلات
- 🔔 نظام إشعارات
- 🔍 بحث متقدم
- 👤 إدارة ملف المستخدم

---

## 💻 متطلبات التشغيل

```bash
Node.js >= 16.x
npm >= 8.x
```

---

## 📦 التثبيت

### 1. استنساخ المشروع

```bash
git clone https://github.com/your-repo/cybermode-dashboard.git
cd cybermode-dashboard
```

### 2. تثبيت المكتبات

```bash
npm install
```

### 3. نسخ ملف البيئة

```bash
cp .env.example .env
```

### 4. تشغيل المشروع

```bash
npm run dev
```

سيتم فتح المشروع تلقائياً على `http://localhost:3000`

---

## 📁 هيكل المشروع

```
cybermode-dashboard/
│
├── public/                          # الملفات الثابتة
│   ├── logo.png
│   └── logo-small.png
│
├── src/                             # مجلد المصدر
│   ├── assets/                      # الأصول
│   │   └── styles/
│   │       └── main.css            # CSS الرئيسي
│   │
│   ├── components/                  # المكونات
│   │   ├── layout/                 # مكونات التخطيط
│   │   │   ├── AppBar.vue
│   │   │   ├── Sidebar.vue
│   │   │   ├── Footer.vue
│   │   │   └── Breadcrumb.vue
│   │   │
│   │   ├── common/                 # مكونات مشتركة
│   │   │   ├── UserProfile.vue
│   │   │   ├── SearchBox.vue
│   │   │   ├── StatsCard.vue
│   │   │   └── ActivityList.vue
│   │   │
│   │   └── navigation/             # مكونات التنقل
│   │       └── MenuGroup.vue
│   │
│   ├── layouts/                     # التخطيطات
│   │   └── DashboardLayout.vue
│   │
│   ├── views/                       # الصفحات
│   │   ├── Dashboard.vue
│   │   ├── Analytics.vue
│   │   ├── Governance.vue
│   │   ├── RiskManagement.vue
│   │   ├── Compliance.vue
│   │   ├── Awareness.vue
│   │   ├── Workflows.vue
│   │   └── Settings.vue
│   │
│   ├── router/                      # التوجيه
│   │   └── index.js
│   │
│   ├── store/                       # إدارة الحالة
│   │   ├── index.js
│   │   └── modules/
│   │       └── auth.js
│   │
│   ├── App.vue                      # المكون الجذر
│   └── main.js                      # نقطة الدخول
│
├── index.html                       # HTML الرئيسي
├── package.json                     # المكتبات
├── vite.config.js                   # إعدادات Vite
├── tailwind.config.js               # إعدادات Tailwind
└── README.md                        # التوثيق
```

---

## 🎨 الاستخدام

### تشغيل بيئة التطوير

```bash
npm run dev
```

### بناء المشروع

```bash
npm run build
```

### معاينة البناء

```bash
npm run preview
```

---

## 🧩 المكونات

### 1. AppBar
شريط التطبيق العلوي مع:
- شعار CyberMode
- مسار التنقل (Breadcrumb)
- أيقونات الإشعارات
- اختيار اللغة

```vue
<AppBar />
```

### 2. Sidebar
القائمة الجانبية مع:
- ملف المستخدم
- مربع البحث
- قائمة التنقل
- زر تسجيل الخروج

```vue
<Sidebar />
```

### 3. StatsCard
بطاقة الإحصائيات

```vue
<StatsCard
  title="التقارير النشطة"
  :value="24"
  icon="mdi-chart-line"
  icon-color="primary"
  trend="up"
  trend-value="+12%"
  @click="handleClick"
/>
```

### 4. ActivityList
قائمة النشاطات

```vue
<ActivityList
  title="النشاطات الأخيرة"
  :activities="activities"
  @view-all="viewAll"
/>
```

---

## 🎨 التخصيص

### 1. تغيير الألوان

في `src/main.js`:

```javascript
theme: {
  themes: {
    light: {
      colors: {
        primary: '#4A6FA5',    // اللون الأساسي
        secondary: '#3B5998',  // اللون الثانوي
        // ...المزيد
      },
    },
  },
}
```

### 2. تعديل القائمة الجانبية

في `src/components/layout/Sidebar.vue`:

```javascript
const menuItems = ref([
  {
    id: 1,
    title: 'عنوان جديد',
    icon: 'mdi-icon-name',
    path: '/new-path',
    children: []
  },
  // ...المزيد
])
```

### 3. إضافة صفحة جديدة

1. أنشئ ملف في `src/views/`:

```vue
<!-- src/views/NewPage.vue -->
<template>
  <div>محتوى الصفحة</div>
</template>
```

2. أضف المسار في `src/router/index.js`:

```javascript
{
  path: '/new-page',
  name: 'new-page',
  component: () => import('../views/NewPage.vue'),
  meta: { title: 'صفحة جديدة' }
}
```

---

## 🏗️ البناء للإنتاج

```bash
# بناء المشروع
npm run build

# المخرجات في مجلد dist/
```

### تحسين الأداء

- ✅ Tree Shaking
- ✅ Code Splitting
- ✅ Lazy Loading
- ✅ Minification
- ✅ Asset Optimization

---

## 🌐 دعم المتصفحات

- ✅ Chrome (آخر نسختين)
- ✅ Firefox (آخر نسختين)
- ✅ Safari (آخر نسختين)
- ✅ Edge (آخر نسختين)

---

## 📱 الاستجابة (Responsive)

التصميم متجاوب بالكامل:
- 📱 Mobile: < 600px
- 📱 Tablet: 600px - 1024px
- 💻 Desktop: > 1024px

---

## 🔐 الأمان

- ✅ Authentication Guards
- ✅ Protected Routes
- ✅ Token Management
- ✅ XSS Protection
- ✅ CSRF Protection

---

## 📚 الموارد

- [Vue.js Documentation](https://vuejs.org/)
- [Vuetify Documentation](https://vuetifyjs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)

---

## 🤝 المساهمة

نرحب بمساهماتكم! يرجى اتباع الخطوات التالية:

1. Fork المشروع
2. أنشئ فرع جديد (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push للفرع (`git push origin feature/AmazingFeature`)
5. افتح Pull Request

---

## 📄 الترخيص

```
Advanced Controls IT Co.
All Software & Intellectual Property Rights Reserved.
Licensed For Use Under Subscription.
GRC V4.0.1
```

---

## 💬 الدعم

للحصول على الدعم:
- 📧 Email: support@cybermode.com
- 🌐 Website: https://cybermode.com
- 📱 Phone: +966 XX XXX XXXX

---

<div align="center">
  <p>صُنع بـ ❤️ في السعودية</p>
  <p><strong>CyberMode © 2024</strong></p>
</div>
