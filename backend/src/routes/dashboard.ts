import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';

const router = Router();

// GET /api/dashboard/stats - الحصول على إحصائيات لوحة التحكم
router.get('/stats', DashboardController.getDashboardStats);

// GET /api/dashboard/monthly-report - الحصول على تقرير شهري
router.get('/monthly-report', DashboardController.getMonthlyReport);

// GET /api/dashboard/recent-activities - الحصول على أحدث الأنشطة
router.get('/recent-activities', DashboardController.getRecentActivities);

// GET /api/dashboard/properties-distribution - توزيع العقارات حسب النوع
router.get('/properties-distribution', DashboardController.getPropertiesDistribution);

// GET /api/dashboard/occupancy-rate - معدل الإشغال
router.get('/occupancy-rate', DashboardController.getOccupancyRate);

// GET /api/dashboard/revenue-analysis - تحليل الإيرادات
router.get('/revenue-analysis', DashboardController.getRevenueAnalysis);

export default router;