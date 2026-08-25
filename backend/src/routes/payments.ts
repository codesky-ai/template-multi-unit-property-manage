import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'قريباً - إدارة المدفوعات', endpoint: '/api/payments' });
});

export default router;