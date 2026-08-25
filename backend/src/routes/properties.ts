import { Router } from 'express';
import { PropertyController } from '../controllers/propertyController';

const router = Router();

// GET /api/properties - الحصول على جميع العقارات
router.get('/', PropertyController.getAllProperties);

// GET /api/properties/search - البحث في العقارات
router.get('/search', PropertyController.searchProperties);

// GET /api/properties/:id - الحصول على عقار واحد
router.get('/:id', PropertyController.getProperty);

// POST /api/properties - إنشاء عقار جديد
router.post('/', PropertyController.createProperty);

// PUT /api/properties/:id - تحديث عقار
router.put('/:id', PropertyController.updateProperty);

// DELETE /api/properties/:id - حذف عقار
router.delete('/:id', PropertyController.deleteProperty);

export default router;