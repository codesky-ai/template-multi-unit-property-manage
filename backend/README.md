# نظام إدارة العقارات والوحدات السكنية - الخادم الخلفي

نظام إدارة شامل للعقارات والوحدات السكنية مع واجهة برمجة تطبيقات RESTful مبنية بـ Node.js وExpress وMySQL.

## المميزات

- ✅ إدارة العقارات والوحدات السكنية
- ✅ متابعة المستأجرين والمالكين
- ✅ نظام العقود والمدفوعات
- ✅ إدارة طلبات الصيانة
- ✅ لوحة تحكم مع إحصائيات شاملة
- ✅ دعم كامل للغة العربية
- ✅ قاعدة بيانات MySQL مع ترميز UTF-8

## المتطلبات

- Node.js 18+ أو أحدث
- MySQL 8.0+ أو أحدث
- npm أو yarn

## التثبيت والإعداد

### 1. تثبيت التبعيات
```bash
npm install
```

### 2. إعداد قاعدة البيانات
```bash
# إنشاء قاعدة البيانات والجداول
mysql -u root -p < ../database/schema.sql

# إدراج البيانات التجريبية
mysql -u root -p property_management_db < ../database/seed.sql
```

### 3. إعداد متغيرات البيئة
```bash
# انسخ ملف البيئة النموذجي
cp .env.example .env

# عدل الإعدادات حسب بيئتك
nano .env
```

المتغيرات المطلوبة:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=property_management_db
PORT=3001
```

### 4. تشغيل الخادم

#### وضع التطوير:
```bash
npm run dev
```

#### وضع الإنتاج:
```bash
npm run build
npm start
```

## هيكل المشروع

```
src/
├── app.ts              # تطبيق Express الرئيسي
├── server.ts           # نقطة البداية للخادم
├── config/
│   └── database.ts     # إعدادات قاعدة البيانات
├── controllers/        # تحكم في منطق العمل
│   ├── propertyController.ts
│   ├── unitController.ts
│   ├── dashboardController.ts
│   └── ...
├── routes/             # تعريف المسارات
│   ├── index.ts
│   ├── properties.ts
│   ├── units.ts
│   └── ...
└── models/             # نماذج البيانات (اختياري)
```

## واجهة برمجة التطبيقات (API)

### العقارات
- `GET /api/properties` - الحصول على جميع العقارات
- `GET /api/properties/:id` - الحصول على عقار واحد
- `POST /api/properties` - إنشاء عقار جديد
- `PUT /api/properties/:id` - تحديث عقار
- `DELETE /api/properties/:id` - حذف عقار

### الوحدات
- `GET /api/units` - الحصول على جميع الوحدات
- `GET /api/units/:id` - الحصول على وحدة واحدة
- `GET /api/units/property/:propertyId` - وحدات عقار معين
- `POST /api/units` - إنشاء وحدة جديدة

### لوحة التحكم
- `GET /api/dashboard/stats` - الإحصائيات الرئيسية
- `GET /api/dashboard/monthly-report` - التقرير الشهري
- `GET /api/dashboard/recent-activities` - الأنشطة الحديثة

### الأصحة
- `GET /api/health` - فحص حالة الخادم
- `GET /api/` - معلومات API

## أمثلة على الاستخدام

### الحصول على جميع العقارات:
```bash
curl http://localhost:3001/api/properties
```

### إنشاء عقار جديد:
```bash
curl -X POST http://localhost:3001/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "name": "مجمع النخيل السكني",
    "address": "الرياض، حي العليا",
    "type": "سكني",
    "totalUnits": 25,
    "ownerId": "1"
  }'
```

## الأمان

- ✅ حماية CORS
- ✅ تحديد معدل الطلبات
- ✅ حماية من هجمات الحقن
- ✅ ترميز آمن للبيانات
- ✅ التحقق من صحة المدخلات

## الرصد والتسجيل

- تسجيل جميع الطلبات والأخطاء
- مراقبة الأداء وقاعدة البيانات
- إحصائيات الاستخدام

## استكشاف الأخطاء

### خطأ الاتصال بقاعدة البيانات:
```bash
# تأكد من تشغيل MySQL
sudo systemctl status mysql

# تحقق من الإعدادات
mysql -u root -p -e "SHOW DATABASES;"
```

### خطأ في المنافذ:
```bash
# تحقق من المنافذ المستخدمة
netstat -tlnp | grep :3001
```

## المساهمة

1. انسخ المستودع
2. أنشئ فرع جديد للميزة
3. اكتب الكود والاختبارات
4. ادفع التغييرات وأرسل pull request

## الترخيص

هذا المشروع مرخص تحت رخصة ISC.

## الدعم

للحصول على المساعدة:
- راجع التوثيق
- تحقق من ملفات السجل
- ابلغ عن المشاكل في GitHub