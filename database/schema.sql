-- سكيما قاعدة بيانات نظام إدارة العقارات والوحدات السكنية
-- MySQL Database Schema for Property Management System
-- الترميز: UTF-8 لدعم اللغة العربية

-- إنشاء قاعدة البيانات
CREATE DATABASE IF NOT EXISTS property_management_db;
USE property_management_db;

-- تعيين الترميز للجلسة
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ==============================================
-- جدول المالكين (Owners)
-- ==============================================
DROP TABLE IF EXISTS owners;
CREATE TABLE owners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL COMMENT 'اسم المالك',
  email VARCHAR(255) UNIQUE NOT NULL COMMENT 'البريد الإلكتروني',
  phone VARCHAR(50) NOT NULL COMMENT 'رقم الهاتف',
  national_id VARCHAR(50) UNIQUE NOT NULL COMMENT 'رقم الهوية الوطنية',
  address TEXT COMMENT 'العنوان',
  image VARCHAR(500) DEFAULT '' COMMENT 'صورة المالك',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'تاريخ الإنشاء',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'تاريخ التحديث'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول المالكين';

-- ==============================================
-- جدول العقارات (Properties)
-- ==============================================
DROP TABLE IF EXISTS properties;
CREATE TABLE properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL COMMENT 'اسم العقار',
  address TEXT NOT NULL COMMENT 'العنوان الكامل',
  property_type ENUM('سكني', 'تجاري', 'مكتبي', 'صناعي') NOT NULL DEFAULT 'سكني' COMMENT 'نوع العقار',
  total_units INT DEFAULT 0 COMMENT 'العدد الإجمالي للوحدات',
  owner_id INT NOT NULL COMMENT 'معرف المالك',
  image VARCHAR(500) DEFAULT '' COMMENT 'صورة العقار',
  description TEXT COMMENT 'وصف العقار',
  year_built INT DEFAULT 2024 COMMENT 'سنة البناء',
  city VARCHAR(100) DEFAULT '' COMMENT 'المدينة',
  district VARCHAR(100) DEFAULT '' COMMENT 'الحي',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'تاريخ الإنشاء',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'تاريخ التحديث',

  FOREIGN KEY (owner_id) REFERENCES owners(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول العقارات';

-- ==============================================
-- جدول المستأجرين (Tenants)
-- ==============================================
DROP TABLE IF EXISTS tenants;
CREATE TABLE tenants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL COMMENT 'اسم المستأجر',
  email VARCHAR(255) UNIQUE NOT NULL COMMENT 'البريد الإلكتروني',
  phone VARCHAR(50) NOT NULL COMMENT 'رقم الهاتف',
  national_id VARCHAR(50) UNIQUE NOT NULL COMMENT 'رقم الهوية الوطنية',
  current_address TEXT COMMENT 'العنوان الحالي',
  employer VARCHAR(255) DEFAULT '' COMMENT 'جهة العمل',
  monthly_income DECIMAL(10,2) DEFAULT 0.00 COMMENT 'الراتب الشهري',
  image VARCHAR(500) DEFAULT '' COMMENT 'صورة المستأجر',
  emergency_contact_name VARCHAR(255) DEFAULT '' COMMENT 'اسم جهة الاتصال للطوارئ',
  emergency_contact_phone VARCHAR(50) DEFAULT '' COMMENT 'هاتف جهة الاتصال للطوارئ',
  emergency_contact_relation VARCHAR(100) DEFAULT '' COMMENT 'صلة القرابة لجهة الاتصال',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'تاريخ الإنشاء',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'تاريخ التحديث'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول المستأجرين';

-- ==============================================
-- جدول الوحدات (Units)
-- ==============================================
DROP TABLE IF EXISTS units;
CREATE TABLE units (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL COMMENT 'معرف العقار',
  unit_number VARCHAR(50) NOT NULL COMMENT 'رقم الوحدة',
  floor INT DEFAULT 0 COMMENT 'رقم الطابق',
  unit_type ENUM('شقة', 'مكتب', 'متجر', 'مستودع', 'استوديو') NOT NULL DEFAULT 'شقة' COMMENT 'نوع الوحدة',
  bedrooms INT DEFAULT 0 COMMENT 'عدد غرف النوم',
  bathrooms INT DEFAULT 0 COMMENT 'عدد الحمامات',
  area DECIMAL(8,2) DEFAULT 0.00 COMMENT 'المساحة بالمتر المربع',
  monthly_rent DECIMAL(10,2) DEFAULT 0.00 COMMENT 'الإيجار الشهري',
  is_available BOOLEAN DEFAULT TRUE COMMENT 'هل الوحدة متاحة',
  current_tenant_id INT NULL COMMENT 'معرف المستأجر الحالي',
  image VARCHAR(500) DEFAULT '' COMMENT 'صورة الوحدة',
  description TEXT COMMENT 'وصف الوحدة',
  amenities TEXT DEFAULT '' COMMENT 'المرافق والخدمات (مفصولة بفواصل)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'تاريخ الإنشاء',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'تاريخ التحديث',

  UNIQUE KEY unique_unit_per_property (property_id, unit_number),
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (current_tenant_id) REFERENCES tenants(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول الوحدات';

-- ==============================================
-- جدول العقود (Contracts)
-- ==============================================
DROP TABLE IF EXISTS contracts;
CREATE TABLE contracts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  unit_id INT NOT NULL COMMENT 'معرف الوحدة',
  tenant_id INT NOT NULL COMMENT 'معرف المستأجر',
  start_date DATE NOT NULL COMMENT 'تاريخ بداية العقد',
  end_date DATE NOT NULL COMMENT 'تاريخ انتهاء العقد',
  monthly_rent DECIMAL(10,2) NOT NULL COMMENT 'الإيجار الشهري',
  security_deposit DECIMAL(10,2) DEFAULT 0.00 COMMENT 'مبلغ التأمين',
  status ENUM('نشط', 'منتهي', 'معلق', 'ملغي') DEFAULT 'نشط' COMMENT 'حالة العقد',
  payment_terms TEXT COMMENT 'شروط الدفع',
  special_terms TEXT COMMENT 'شروط خاصة',
  signed_date DATE COMMENT 'تاريخ التوقيع',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'تاريخ الإنشاء',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'تاريخ التحديث',

  FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول العقود';

-- ==============================================
-- جدول المدفوعات (Payments)
-- ==============================================
DROP TABLE IF EXISTS payments;
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contract_id INT NOT NULL COMMENT 'معرف العقد',
  amount DECIMAL(10,2) NOT NULL COMMENT 'المبلغ',
  due_date DATE NOT NULL COMMENT 'تاريخ الاستحقاق',
  paid_date DATE NULL COMMENT 'تاريخ الدفع الفعلي',
  status ENUM('مدفوع', 'معلق', 'متأخر') DEFAULT 'معلق' COMMENT 'حالة الدفع',
  payment_method ENUM('نقدي', 'تحويل بنكي', 'شيك', 'بطاقة ائتمان') DEFAULT 'تحويل بنكي' COMMENT 'طريقة الدفع',
  notes TEXT COMMENT 'ملاحظات',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'تاريخ الإنشاء',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'تاريخ التحديث',

  FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول المدفوعات';

-- ==============================================
-- جدول طلبات الصيانة (Maintenance Requests)
-- ==============================================
DROP TABLE IF EXISTS maintenance_requests;
CREATE TABLE maintenance_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  unit_id INT NOT NULL COMMENT 'معرف الوحدة',
  tenant_id INT NOT NULL COMMENT 'معرف المستأجر',
  title VARCHAR(255) NOT NULL COMMENT 'عنوان الطلب',
  description TEXT NOT NULL COMMENT 'وصف المشكلة',
  priority ENUM('عاجل', 'متوسط', 'منخفض') DEFAULT 'متوسط' COMMENT 'الأولوية',
  status ENUM('جديد', 'قيد الصيانة', 'مكتمل', 'مؤجل') DEFAULT 'جديد' COMMENT 'حالة الطلب',
  cost DECIMAL(10,2) NULL COMMENT 'تكلفة الصيانة',
  assigned_to VARCHAR(255) DEFAULT '' COMMENT 'المكلف بالصيانة',
  completed_date DATE NULL COMMENT 'تاريخ اكتمال الصيانة',
  images TEXT DEFAULT '' COMMENT 'روابط الصور (مفصولة بفواصل)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'تاريخ الإنشاء',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'تاريخ التحديث',

  FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول طلبات الصيانة';

-- ==============================================
-- إنشاء الفهارس للأداء
-- ==============================================

-- فهارس جدول العقارات
CREATE INDEX idx_properties_owner_id ON properties(owner_id);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_name ON properties(name);

-- فهارس جدول الوحدات
CREATE INDEX idx_units_property_id ON units(property_id);
CREATE INDEX idx_units_is_available ON units(is_available);
CREATE INDEX idx_units_type ON units(unit_type);
CREATE INDEX idx_units_tenant_id ON units(current_tenant_id);

-- فهارس جدول العقود
CREATE INDEX idx_contracts_unit_id ON contracts(unit_id);
CREATE INDEX idx_contracts_tenant_id ON contracts(tenant_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_dates ON contracts(start_date, end_date);

-- فهارس جدول المدفوعات
CREATE INDEX idx_payments_contract_id ON payments(contract_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_due_date ON payments(due_date);
CREATE INDEX idx_payments_paid_date ON payments(paid_date);

-- فهارس جدول طلبات الصيانة
CREATE INDEX idx_maintenance_unit_id ON maintenance_requests(unit_id);
CREATE INDEX idx_maintenance_tenant_id ON maintenance_requests(tenant_id);
CREATE INDEX idx_maintenance_status ON maintenance_requests(status);
CREATE INDEX idx_maintenance_priority ON maintenance_requests(priority);

-- فهارس جدول المالكين
CREATE INDEX idx_owners_name ON owners(name);
CREATE INDEX idx_owners_email ON owners(email);

-- فهارس جدول المستأجرين
CREATE INDEX idx_tenants_name ON tenants(name);
CREATE INDEX idx_tenants_email ON tenants(email);

-- ==============================================
-- إعداد الصلاحيات والأمان
-- ==============================================

-- تأكد من صحة الترميز
ALTER DATABASE property_management_db CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- عرض الجداول المنشأة
SHOW TABLES;

-- عرض هيكل بعض الجداول الرئيسية
DESCRIBE properties;
DESCRIBE units;
DESCRIBE owners;
DESCRIBE tenants;

SELECT 'تم إنشاء قاعدة البيانات بنجاح!' as status;