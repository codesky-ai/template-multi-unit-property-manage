import { Router } from 'express';
import { OwnerController } from '../controllers/ownerController';

const router = Router();

// GET /api/owners - الحصول على جميع المالكين
router.get('/', OwnerController.getAllOwners);

// GET /api/owners/:id - الحصول على مالك واحد
router.get('/:id', OwnerController.getOwner);

export default router;