import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'قريباً - إدارة العقود', endpoint: '/api/contracts' });
});

export default router;