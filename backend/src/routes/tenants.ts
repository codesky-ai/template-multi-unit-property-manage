import { Router } from 'express';
import { TenantController } from '../controllers/tenantController';

const router = Router();

router.get('/', TenantController.getAllTenants);
router.get('/:id', TenantController.getTenant);

export default router;