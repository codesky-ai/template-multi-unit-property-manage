import app from './app';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';

// تحميل متغيرات البيئة
dotenv.config();

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // تهيئة اتصال قاعدة البيانات
    await initializeDatabase();
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');

    // بدء الخادم
    app.listen(PORT, () => {
      console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
      console.log(`🌐 API متاح على: http://localhost:${PORT}/api`);
      console.log(`📊 حالة الخادم: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ خطأ في بدء الخادم:', error);
    process.exit(1);
  }
}

// التعامل مع إيقاف الخادم بشكل نظيف
process.on('SIGINT', () => {
  console.log('
🛑 إيقاف الخادم...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('
🛑 إيقاف الخادم...');
  process.exit(0);
});

startServer();