import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@/utils/token.util';
import type { Role } from '@/types/auth.types.js';

declare module 'express-serve-static-core' {
  interface Request {
    user?: { userId: string; email: string; role: Role };
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or malformed token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired access token' });
  }
}