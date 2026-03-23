import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import type { JwtPayload, AuthTokens } from '@/types/auth.types';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function generateTokens(payload: JwtPayload): AuthTokens {
  const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });

  const refreshToken = jwt.sign(
    { ...payload, jti: uuidv4() }, // jti = unique ID per token for rotation tracking
    REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload & { jti: string } {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload & { jti: string };
}