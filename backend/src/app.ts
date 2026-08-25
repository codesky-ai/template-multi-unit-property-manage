import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import routes from './routes';

const app = express();

// إعدادات الأمان والضغط
app.use(helmet());
app.use(compression());

// إعدادات CORS للواجهة الأمامية
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language']
}));

// تحديد معدل الطلبات
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100, // حد أقصى 100 طلب لكل IP خلال 15 دقيقة
  message: {
    error: 'تم تجاوز عدد الطلبات المسموح. يرجى المحاولة مرة أخرى لاحقاً.',
    code: 'TOO_MANY_REQUESTS'
  }
});

app.use('/api', limiter);

// تسجيل الطلبات
app.use(morgan('combined', {
  skip: (req, res) => res.statusCode < 400 // تسجيل الأخطاء فقط
}));

// تحليل JSON مع دعم UTF-8
app.use(express.json({
  limit: '10mb',
  type: 'application/json'
}));

app.use(express.urlencoded({
  extended: true,
  limit: '10mb'
}));

// تعيين ترميز UTF-8 للاستجابات
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// الطرق الرئيسية
app.use('/api', routes);

// طريقة فحص حالة الخادم
app.get('/api/health', (req, res) => {
  res.json({
    status: 'يعمل',
    timestamp: new Date().toISOString(),
    message: 'خادم إدارة العقارات يعمل بشكل طبيعي',
    version: '1.0.0'
  });
});

// معالجة الطرق غير الموجودة
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'الطريق غير موجود',
    message: `لا يمكن العثور على ${req.originalUrl}`,
    code: 'ROUTE_NOT_FOUND'
  });
});

// معالجة الأخطاء العامة
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('خطأ في الخادم:', err);

  res.status(err.status || 500).json({
    error: err.message || 'خطأ داخلي في الخادم',
    code: err.code || 'INTERNAL_SERVER_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;