import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// إعدادات قاعدة البيانات
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'property_management_db',
  charset: 'utf8mb4', // دعم الأحرف العربية
  timezone: '+03:00', // توقيت السعودية
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  multipleStatements: false
};

// إنشاء مجموعة الاتصالات
export const pool = mysql.createPool(dbConfig);

// اختبار الاتصال
export async function testConnection(): Promise<boolean> {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('✅ تم اختبار اتصال قاعدة البيانات بنجاح');
    return true;
  } catch (error) {
    console.error('❌ فشل في الاتصال بقاعدة البيانات:', error);
    return false;
  }
}

// تهيئة قاعدة البيانات
export async function initializeDatabase(): Promise<void> {
  try {
    // اختبار الاتصال أولاً
    const isConnected = await testConnection();

    if (!isConnected) {
      throw new Error('فشل في الاتصال بقاعدة البيانات');
    }

    // التحقق من وجود الجداول
    const [tables] = await pool.execute('SHOW TABLES');
    console.log(`📊 تم العثور على ${(tables as any[]).length} جدول في قاعدة البيانات`);

    // إضافة فهارس إضافية إذا لزم الأمر
    await createIndexesIfNotExists();

  } catch (error) {
    console.error('❌ خطأ في تهيئة قاعدة البيانات:', error);
    throw error;
  }
}

// إضافة فهارس إضافية للأداء
async function createIndexesIfNotExists(): Promise<void> {
  try {
    const queries = [
      // فهارس للعقارات
      'CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id)',
      'CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city)',
      'CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type)',

      // فهارس للوحدات
      'CREATE INDEX IF NOT EXISTS idx_units_property_id ON units(property_id)',
      'CREATE INDEX IF NOT EXISTS idx_units_is_available ON units(is_available)',
      'CREATE INDEX IF NOT EXISTS idx_units_type ON units(unit_type)',

      // فهارس للعقود
      'CREATE INDEX IF NOT EXISTS idx_contracts_unit_id ON contracts(unit_id)',
      'CREATE INDEX IF NOT EXISTS idx_contracts_tenant_id ON contracts(tenant_id)',
      'CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status)',

      // فهارس للدفعات
      'CREATE INDEX IF NOT EXISTS idx_payments_contract_id ON payments(contract_id)',
      'CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status)',
      'CREATE INDEX IF NOT EXISTS idx_payments_due_date ON payments(due_date)',

      // فهارس للصيانة
      'CREATE INDEX IF NOT EXISTS idx_maintenance_unit_id ON maintenance_requests(unit_id)',
      'CREATE INDEX IF NOT EXISTS idx_maintenance_tenant_id ON maintenance_requests(tenant_id)',
      'CREATE INDEX IF NOT EXISTS idx_maintenance_status ON maintenance_requests(status)',
      'CREATE INDEX IF NOT EXISTS idx_maintenance_priority ON maintenance_requests(priority)'
    ];

    for (const query of queries) {
      try {
        await pool.execute(query);
      } catch (err) {
        // تجاهل الأخطاء إذا كان الفهرس موجود بالفعل
        console.log('تم تخطي إنشاء فهرس موجود');
      }
    }

    console.log('✅ تم التحقق من الفهارس وإضافة ما هو مطلوب');
  } catch (error) {
    console.warn('⚠️ تحذير في إنشاء الفهارس:', error);
  }
}

// دالة مساعدة لتنفيذ الاستعلامات
export async function executeQuery<T = any>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const [rows] = await pool.execute(query, params);
    return rows as T[];
  } catch (error) {
    console.error('خطأ في تنفيذ الاستعلام:', query, error);
    throw error;
  }
}

// دالة مساعدة للحصول على سجل واحد
export async function findOne<T = any>(
  query: string,
  params: any[] = []
): Promise<T | null> {
  try {
    const results = await executeQuery<T>(query, params);
    return results.length > 0 ? results[0]! : null;
  } catch (error) {
    console.error('خطأ في البحث عن سجل:', error);
    throw error;
  }
}

// دالة مساعدة للإدراج
export async function insertRecord(
  table: string,
  data: Record<string, any>
): Promise<number> {
  try {
    const keys = Object.keys(data);
    const placeholders = keys.map(() => '?').join(', ');
    const values = keys.map(key => data[key]);

    const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    const [result] = await pool.execute(query, values);

    return (result as any).insertId;
  } catch (error) {
    console.error('خطأ في إدراج البيانات:', error);
    throw error;
  }
}

// دالة مساعدة للتحديث
export async function updateRecord(
  table: string,
  id: number,
  data: Record<string, any>
): Promise<boolean> {
  try {
    const keys = Object.keys(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const values = [...keys.map(key => data[key]), id];

    const query = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
    const [result] = await pool.execute(query, values);

    return (result as any).affectedRows > 0;
  } catch (error) {
    console.error('خطأ في تحديث البيانات:', error);
    throw error;
  }
}

// دالة مساعدة للحذف
export async function deleteRecord(table: string, id: number): Promise<boolean> {
  try {
    const query = `DELETE FROM ${table} WHERE id = ?`;
    const [result] = await pool.execute(query, [id]);

    return (result as any).affectedRows > 0;
  } catch (error) {
    console.error('خطأ في حذف البيانات:', error);
    throw error;
  }
}