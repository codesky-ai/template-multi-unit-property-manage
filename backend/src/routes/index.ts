import { Router } from 'express';
import propertiesRouter from './properties';
import unitsRouter from './units';
import ownersRouter from './owners';
import tenantsRouter from './tenants';
import contractsRouter from './contracts';
import paymentsRouter from './payments';
import maintenanceRouter from './maintenance';
import dashboardRouter from './dashboard';

const router = Router();

// ربط جميع المسارات
router.use('/properties', propertiesRouter);
router.use('/units', unitsRouter);
router.use('/owners', ownersRouter);
router.use('/tenants', tenantsRouter);
router.use('/contracts', contractsRouter);
router.use('/payments', paymentsRouter);
router.use('/maintenance-requests', maintenanceRouter);
router.use('/dashboard', dashboardRouter);

// مسار افتراضي للواجهة
router.get('/', (req, res) => {
  res.json({
    message: 'مرحباً بكم في نظام إدارة العقارات والوحدات السكنية',
    version: '1.0.0',
    endpoints: {
      dashboard: '/api/dashboard',
      properties: '/api/properties',
      units: '/api/units',
      owners: '/api/owners',
      tenants: '/api/tenants',
      contracts: '/api/contracts',
      payments: '/api/payments',
      maintenance: '/api/maintenance-requests',
      health: '/api/health'
    },
    features: [
      'إدارة العقارات والوحدات السكنية',
      'متابعة المستأجرين والعقود',
      'نظام المدفوعات والفواتير',
      'إدارة طلبات الصيانة',
      'تقارير وإحصائيات شاملة'
    ]
  });
});

export default router;