import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'قريباً - إدارة طلبات الصيانة', endpoint: '/api/maintenance-requests' });
});

export default router;