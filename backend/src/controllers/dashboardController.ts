import { Request, Response } from 'express';
import { executeQuery, findOne } from '../config/database';

export class DashboardController {
  // الحصول على إحصائيات لوحة التحكم
  static async getDashboardStats(req: Request, res: Response) {
    try {
      // إحصائيات أساسية
      const [
        propertiesCount,
        unitsCount,
        occupiedUnitsCount,
        availableUnitsCount,
        tenantsCount,
        activeContractsCount
      ] = await Promise.all([
        findOne<{ count: number }>('SELECT COUNT(*) as count FROM properties'),
        findOne<{ count: number }>('SELECT COUNT(*) as count FROM units'),
        findOne<{ count: number }>('SELECT COUNT(*) as count FROM units WHERE is_available = false'),
        findOne<{ count: number }>('SELECT COUNT(*) as count FROM units WHERE is_available = true'),
        findOne<{ count: number }>('SELECT COUNT(*) as count FROM tenants'),
        findOne<{ count: number }>('SELECT COUNT(*) as count FROM contracts WHERE status = "نشط"')
      ]);

      // حساب الإيرادات الشهرية من العقود النشطة
      const monthlyRevenueResult = await findOne<{ revenue: number }>(
        `SELECT COALESCE(SUM(monthly_rent), 0) as revenue
         FROM contracts c
         JOIN units u ON c.unit_id = u.id
         WHERE c.status = "نشط"`
      );

      // عدد طلبات الصيانة المعلقة
      const pendingMaintenanceResult = await findOne<{ count: number }>(
        `SELECT COUNT(*) as count FROM maintenance_requests
         WHERE status IN ("جديد", "قيد الصيانة")`
      );

      // عدد المدفوعات المتأخرة
      const overduePaymentsResult = await findOne<{ count: number }>(
        `SELECT COUNT(*) as count FROM payments
         WHERE status = "متأخر" OR (status = "معلق" AND due_date < CURDATE())`
      );

      const stats = {
        totalProperties: propertiesCount?.count || 0,
        totalUnits: unitsCount?.count || 0,
        occupiedUnits: occupiedUnitsCount?.count || 0,
        availableUnits: availableUnitsCount?.count || 0,
        totalTenants: tenantsCount?.count || 0,
        activeContracts: activeContractsCount?.count || 0,
        monthlyRevenue: monthlyRevenueResult?.revenue || 0,
        pendingMaintenanceRequests: pendingMaintenanceResult?.count || 0,
        overduePayments: overduePaymentsResult?.count || 0
      };

      res.json(stats);
    } catch (error) {
      console.error('خطأ في الحصول على إحصائيات لوحة التحكم:', error);
      res.status(500).json({
        error: 'خطأ داخلي في الخادم',
        message: 'فشل في الحصول على إحصائيات لوحة التحكم'
      });
    }
  }

  // الحصول على تقرير شهري
  static async getMonthlyReport(req: Request, res: Response) {
    try {
      const { year = new Date().getFullYear(), month = new Date().getMonth() + 1 } = req.query;

      // الإيرادات الشهرية
      const monthlyPayments = await executeQuery(
        `SELECT
          DATE_FORMAT(paid_date, '%Y-%m-%d') as date,
          SUM(amount) as daily_revenue,
          COUNT(*) as payments_count
         FROM payments
         WHERE YEAR(paid_date) = ? AND MONTH(paid_date) = ? AND status = "مدفوع"
         GROUP BY DATE_FORMAT(paid_date, '%Y-%m-%d')
         ORDER BY date`,
        [year, month]
      );

      // العقود الجديدة في الشهر
      const newContracts = await executeQuery(
        `SELECT COUNT(*) as count FROM contracts
         WHERE YEAR(created_at) = ? AND MONTH(created_at) = ?`,
        [year, month]
      );

      // طلبات الصيانة في الشهر
      const maintenanceRequests = await executeQuery(
        `SELECT
          status,
          COUNT(*) as count
         FROM maintenance_requests
         WHERE YEAR(created_at) = ? AND MONTH(created_at) = ?
         GROUP BY status`,
        [year, month]
      );

      // الوحدات المؤجرة الجديدة
      const newRentals = await executeQuery(
        `SELECT COUNT(*) as count FROM contracts
         WHERE YEAR(start_date) = ? AND MONTH(start_date) = ? AND status = "نشط"`,
        [year, month]
      );

      // إجمالي الإيرادات للشهر
      const totalRevenueResult = await findOne<{ total: number }>(
        `SELECT COALESCE(SUM(amount), 0) as total FROM payments
         WHERE YEAR(paid_date) = ? AND MONTH(paid_date) = ? AND status = "مدفوع"`,
        [year, month]
      );

      const report = {
        period: `${year}-${month.toString().padStart(2, '0')}`,
        totalRevenue: totalRevenueResult?.total || 0,
        dailyPayments: monthlyPayments,
        newContracts: newContracts[0]?.count || 0,
        newRentals: newRentals[0]?.count || 0,
        maintenanceByStatus: maintenanceRequests.reduce((acc: any, curr: any) => {
          acc[curr.status] = curr.count;
          return acc;
        }, {})
      };

      res.json(report);
    } catch (error) {
      console.error('خطأ في الحصول على التقرير الشهري:', error);
      res.status(500).json({
        error: 'خطأ داخلي في الخادم',
        message: 'فشل في الحصول على التقرير الشهري'
      });
    }
  }

  // الحصول على أحدث الأنشطة
  static async getRecentActivities(req: Request, res: Response) {
    try {
      const limit = parseInt((req.query.limit as string) || '10');

      // أحدث العقود
      const recentContracts = await executeQuery(
        `SELECT
          'عقد جديد' as type,
          CONCAT('تم توقيع عقد جديد للوحدة ', u.unit_number, ' في ', p.name) as description,
          c.created_at as timestamp
         FROM contracts c
         JOIN units u ON c.unit_id = u.id
         JOIN properties p ON u.property_id = p.id
         ORDER BY c.created_at DESC
         LIMIT ?`,
        [Math.ceil(limit / 3)]
      );

      // أحدث الدفعات
      const recentPayments = await executeQuery(
        `SELECT
          'دفعة جديدة' as type,
          CONCAT('تم استلام دفعة بقيمة ', amount, ' ريال') as description,
          paid_date as timestamp
         FROM payments
         WHERE status = "مدفوع" AND paid_date IS NOT NULL
         ORDER BY paid_date DESC
         LIMIT ?`,
        [Math.ceil(limit / 3)]
      );

      // أحدث طلبات الصيانة
      const recentMaintenance = await executeQuery(
        `SELECT
          'طلب صيانة' as type,
          CONCAT('طلب صيانة جديد: ', title) as description,
          created_at as timestamp
         FROM maintenance_requests
         ORDER BY created_at DESC
         LIMIT ?`,
        [Math.ceil(limit / 3)]
      );

      // دمج جميع الأنشطة وترتيبها حسب التاريخ
      const allActivities = [
        ...recentContracts,
        ...recentPayments,
        ...recentMaintenance
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);

      res.json(allActivities);
    } catch (error) {
      console.error('خطأ في الحصول على الأنشطة الحديثة:', error);
      res.status(500).json({
        error: 'خطأ داخلي في الخادم',
        message: 'فشل في الحصول على الأنشطة الحديثة'
      });
    }
  }

  // الحصول على توزيع العقارات حسب النوع
  static async getPropertiesDistribution(req: Request, res: Response) {
    try {
      const distribution = await executeQuery(
        `SELECT
          property_type as type,
          COUNT(*) as count,
          ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM properties)), 1) as percentage
         FROM properties
         GROUP BY property_type
         ORDER BY count DESC`
      );

      res.json(distribution);
    } catch (error) {
      console.error('خطأ في الحصول على توزيع العقارات:', error);
      res.status(500).json({
        error: 'خطأ داخلي في الخادم',
        message: 'فشل في الحصول على توزيع العقارات'
      });
    }
  }

  // الحصول على معدل الإشغال
  static async getOccupancyRate(req: Request, res: Response) {
    try {
      const occupancyStats = await findOne<{
        total_units: number;
        occupied_units: number;
        available_units: number;
        occupancy_rate: number;
      }>(
        `SELECT
          COUNT(*) as total_units,
          SUM(CASE WHEN is_available = false THEN 1 ELSE 0 END) as occupied_units,
          SUM(CASE WHEN is_available = true THEN 1 ELSE 0 END) as available_units,
          ROUND((SUM(CASE WHEN is_available = false THEN 1 ELSE 0 END) * 100.0 / COUNT(*)), 1) as occupancy_rate
         FROM units`
      );

      res.json(occupancyStats || {
        total_units: 0,
        occupied_units: 0,
        available_units: 0,
        occupancy_rate: 0
      });
    } catch (error) {
      console.error('خطأ في الحصول على معدل الإشغال:', error);
      res.status(500).json({
        error: 'خطأ داخلي في الخادم',
        message: 'فشل في الحصول على معدل الإشغال'
      });
    }
  }

  // الحصول على تحليل الإيرادات
  static async getRevenueAnalysis(req: Request, res: Response) {
    try {
      const { period = 'monthly' } = req.query;

      let dateFormat: string;
      let groupBy: string;

      switch (period) {
        case 'daily':
          dateFormat = '%Y-%m-%d';
          groupBy = 'DATE(paid_date)';
          break;
        case 'weekly':
          dateFormat = '%Y-%u';
          groupBy = 'YEAR(paid_date), WEEK(paid_date)';
          break;
        case 'yearly':
          dateFormat = '%Y';
          groupBy = 'YEAR(paid_date)';
          break;
        default:
          dateFormat = '%Y-%m';
          groupBy = 'YEAR(paid_date), MONTH(paid_date)';
      }

      const revenueData = await executeQuery(
        `SELECT
          DATE_FORMAT(paid_date, ?) as period,
          SUM(amount) as revenue,
          COUNT(*) as transactions_count,
          AVG(amount) as avg_transaction
         FROM payments
         WHERE status = "مدفوع" AND paid_date IS NOT NULL
         AND paid_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
         GROUP BY ${groupBy}
         ORDER BY period`,
        [dateFormat]
      );

      // حساب النمو مقارنة بالفترة السابقة
      const currentPeriodRevenue = revenueData.slice(-1)[0]?.revenue || 0;
      const previousPeriodRevenue = revenueData.slice(-2, -1)[0]?.revenue || 0;

      const growthRate = previousPeriodRevenue > 0
        ? ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100
        : 0;

      res.json({
        data: revenueData,
        summary: {
          currentPeriodRevenue,
          previousPeriodRevenue,
          growthRate: Math.round(growthRate * 100) / 100,
          totalRevenue: revenueData.reduce((sum, item) => sum + (item.revenue || 0), 0),
          averageRevenue: Math.round(revenueData.reduce((sum, item) => sum + (item.revenue || 0), 0) / (revenueData.length || 1))
        }
      });
    } catch (error) {
      console.error('خطأ في تحليل الإيرادات:', error);
      res.status(500).json({
        error: 'خطأ داخلي في الخادم',
        message: 'فشل في تحليل الإيرادات'
      });
    }
  }
}