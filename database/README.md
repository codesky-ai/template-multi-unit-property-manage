# قاعدة بيانات نظام إدارة العقارات والوحدات السكنية

دليل إعداد وإدارة قاعدة بيانات MySQL لنظام إدارة العقارات باللغة العربية.

## نظرة عامة

قاعدة البيانات مصممة لدعم:
- ✅ إدارة العقارات والوحدات السكنية
- ✅ متابعة المالكين والمستأجرين
- ✅ إدارة العقود والمدفوعات
- ✅ تتبع طلبات الصيانة
- ✅ دعم كامل للغة العربية مع ترميز UTF-8

## المتطلبات

- **MySQL Server 8.0+** أو أحدث
- **MySQL Client** أو MySQL Workbench
- دعم ترميز **UTF-8 (utf8mb4)**

## خطوات الإعداد

### 1. إنشاء قاعدة البيانات والجداول

```bash
# تشغيل سكيما قاعدة البيانات
mysql -u root -p < schema.sql
```

### 2. إدراج البيانات التجريبية

```bash
# إدراج البيانات التجريبية العربية
mysql -u root -p property_management_db < seed.sql
```

### 3. التحقق من الإعداد

```bash
# دخول قاعدة البيانات
mysql -u root -p property_management_db

# عرض الجداول المنشأة
SHOW TABLES;

# عرض البيانات التجريبية
SELECT * FROM properties;
SELECT * FROM units;
```

## هيكل قاعدة البيانات

### الجداول الرئيسية

| الجدول | الوصف | عدد الحقول |
|---------|---------|-------------|
| `owners` | المالكين | 8 حقول |
| `properties` | العقارات | 12 حقل |
| `tenants` | المستأجرين | 12 حقل |
| `units` | الوحدات | 15 حقل |
| `contracts` | العقود | 12 حقل |
| `payments` | المدفوعات | 10 حقول |
| `maintenance_requests` | طلبات الصيانة | 12 حقل |

### العلاقات بين الجداول

```
owners (1) ──→ (N) properties
properties (1) ──→ (N) units
tenants (1) ──→ (N) contracts
units (1) ──→ (N) contracts
contracts (1) ──→ (N) payments
units (1) ──→ (N) maintenance_requests
```

## البيانات التجريبية

### إحصائيات البيانات المدرجة:
- **4 مالكين** مع معلومات كاملة
- **4 عقارات** في مدن مختلفة (الرياض، جدة، الدمام)
- **5 مستأجرين** مع بيانات الاتصال والطوارئ
- **9 وحدات** متنوعة (شقق، مكاتب)
- **4 عقود نشطة** مع شروط مختلفة
- **10 مدفوعات** بحالات متنوعة
- **5 طلبات صيانة** بأولويات مختلفة

### أنواع العقارات:
- 🏘️ **سكني**: مجمعات سكنية وشقق
- 🏢 **تجاري**: مكاتب ومحلات
- 🏭 **مكتبي**: مباني إدارية
- 🏗️ **صناعي**: مستودعات ومصانع

### أنواع الوحدات:
- 🏠 **شقة**: للسكن العائلي
- 💼 **مكتب**: للاستخدام التجاري
- 🛍️ **متجر**: للأنشطة التجارية
- 📦 **مستودع**: للتخزين
- 🏡 **استوديو**: وحدة سكنية صغيرة

## الاستعلامات المفيدة

### عرض العقارات مع الوحدات:
```sql
SELECT 
    p.name as property_name,
    p.city,
    COUNT(u.id) as total_units,
    SUM(CASE WHEN u.is_available = FALSE THEN 1 ELSE 0 END) as occupied_units
FROM properties p
LEFT JOIN units u ON p.id = u.property_id
GROUP BY p.id, p.name, p.city;
```

### الإيرادات الشهرية:
```sql
SELECT 
    SUM(c.monthly_rent) as monthly_revenue
FROM contracts c
WHERE c.status = 'نشط';
```

### طلبات الصيانة العاجلة:
```sql
SELECT 
    mr.title,
    mr.priority,
    mr.status,
    p.name as property_name,
    u.unit_number
FROM maintenance_requests mr
JOIN units u ON mr.unit_id = u.id
JOIN properties p ON u.property_id = p.id
WHERE mr.priority = 'عاجل' AND mr.status != 'مكتمل'
ORDER BY mr.created_at;
```

### المدفوعات المتأخرة:
```sql
SELECT 
    p.amount,
    p.due_date,
    t.name as tenant_name,
    pr.name as property_name,
    u.unit_number
FROM payments p
JOIN contracts c ON p.contract_id = c.id
JOIN units u ON c.unit_id = u.id
JOIN properties pr ON u.property_id = pr.id
JOIN tenants t ON c.tenant_id = t.id
WHERE p.status = 'معلق' AND p.due_date < CURDATE();
```

## النسخ الاحتياطي والاستعادة

### إنشاء نسخة احتياطية:
```bash
# نسخ احتياطي كامل
mysqldump -u root -p property_management_db > backup.sql

# نسخ احتياطي للبيانات فقط
mysqldump -u root -p --no-create-info property_management_db > data_backup.sql
```

### استعادة النسخة الاحتياطية:
```bash
# استعادة النسخة الاحتياطية
mysql -u root -p property_management_db < backup.sql
```

## إعدادات الأداء

### فهارس محسنة للأداء:
- فهرس على `properties.owner_id` للبحث السريع
- فهرس على `units.property_id` لجلب وحدات العقار
- فهرس على `contracts.status` لتصفية العقود
- فهرس على `payments.due_date` لتتبع الاستحقاقات
- فهرس على `maintenance_requests.status` لحالة الصيانة

### توصيات الأداء:
```sql
-- تحليل الاستعلامات البطيئة
SHOW VARIABLES LIKE 'slow_query_log';

-- عرض حالة الفهارس
SHOW INDEX FROM properties;
SHOW INDEX FROM units;
```

## استكشاف الأخطاء

### مشاكل الترميز:
```sql
-- التأكد من ترميز قاعدة البيانات
SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME 
FROM information_schema.SCHEMATA 
WHERE SCHEMA_NAME = 'property_management_db';

-- التأكد من ترميز الجداول
SELECT TABLE_NAME, TABLE_COLLATION 
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'property_management_db';
```

### مشاكل المفاتيح الخارجية:
```sql
-- عرض المفاتيح الخارجية
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'property_management_db'
AND REFERENCED_TABLE_NAME IS NOT NULL;
```

## إعداد الخادم الخلفي

بعد إعداد قاعدة البيانات، قم بتحديث ملف `.env` في مجلد backend:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=property_management_db
PORT=3001
```

## الأمان والحماية

- ✅ استخدام مفاتيح خارجية للحفاظ على سلامة البيانات
- ✅ قيود على الحذف لمنع فقدان البيانات المرتبطة
- ✅ ترميز UTF-8 آمن للنصوص العربية
- ✅ فهارس محسنة لتسريع الاستعلامات
- ✅ قيود التحقق من صحة البيانات

## الدعم

للحصول على المساعدة:
1. راجع ملفات السجل: `mysql.log`
2. تحقق من الاتصال: `mysql -u root -p`
3. اختبر الاستعلامات: `mysql workbench`

---

📝 **ملاحظة**: هذه قاعدة بيانات تجريبية للتطوير. لا تستخدم في بيئة الإنتاج بدون إعدادات أمان إضافية.