
import type { Request, Response } from 'express';
import * as authService from '@/services/auth.service';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['admin', 'member']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export async function register(req: Request, res: Response) {
  const parseResult = registerSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Invalid request', errors: parseResult.error.flatten() });
  }
  const { email, password, role } = parseResult.data;
  const validRole = role === 'admin' ? 'admin' : 'member';
  const user = await authService.register(email, password, validRole);
  res.status(201).json(user);
}

export async function login(req: Request, res: Response) {
  const parseResult = loginSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Invalid request', errors: parseResult.error.flatten() });
  }
  const { email, password } = parseResult.data;
  const tokens = await authService.login(email, password);
  res.json(tokens);
}

export async function refresh(req: Request, res: Response) {
  const parseResult = refreshSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Invalid request', errors: parseResult.error.flatten() });
  }
  const { refreshToken } = parseResult.data;
  const tokens = await authService.refresh(refreshToken);
  res.json(tokens);
}

export async function logout(req: Request, res: Response) {
  const parseResult = refreshSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Invalid request', errors: parseResult.error.flatten() });
  }
  const { refreshToken } = parseResult.data;
  await authService.logout(refreshToken);
  res.status(204).send();
}