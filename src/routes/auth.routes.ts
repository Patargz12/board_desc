import { Router } from 'express';
import * as authService from '@/services/auth.service';

const router = Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.register(email, password);
  res.status(201).json(user);
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const tokens = await authService.login(email, password);
  res.json(tokens);
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });
  const tokens = await authService.refresh(refreshToken);
  res.json(tokens);
});

router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });
  await authService.logout(refreshToken);
  res.status(204).send();
});

export default router;