import { Router } from 'express';
import { UnitController } from '../controllers/unitController';

const router = Router();

// GET /api/units - الحصول على جميع الوحدات
router.get('/', UnitController.getAllUnits);

// GET /api/units/search - البحث في الوحدات
router.get('/search', UnitController.searchUnits);

// GET /api/units/property/:propertyId - الحصول على وحدات عقار معين
router.get('/property/:propertyId', UnitController.getUnitsByProperty);

// GET /api/units/:id - الحصول على وحدة واحدة
router.get('/:id', UnitController.getUnit);

// POST /api/units - إنشاء وحدة جديدة
router.post('/', UnitController.createUnit);

// PUT /api/units/:id - تحديث وحدة
router.put('/:id', UnitController.updateUnit);

// DELETE /api/units/:id - حذف وحدة
router.delete('/:id', UnitController.deleteUnit);

export default router;