import bcrypt from 'bcrypt';
import { supabase } from '@/lib/supabase';
import {
  generateTokens,
  verifyRefreshToken,
  REFRESH_TOKEN_EXPIRY_MS,
} from '@/utils/token.util';
import type { Role, AuthTokens, UserRow, RefreshTokenRow } from '@/types/auth.types.js';

const SALT_ROUNDS = 10;

// ─── Register ────────────────────────────────────────────────────────────────

export async function register(email: string, password: string, role: Role = 'member') {
  // Check if email already exists
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existing) throw new Error('Email already in use');

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const { data: user, error } = await supabase
    .from('users')
    .insert({ email, password_hash: passwordHash, role })
    .select('id, email, role, created_at')
    .single();

  if (error) throw new Error(error.message);

  return user;
}

// ─── Login ───────────────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<AuthTokens> {
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single<UserRow>();

  // Dummy hash prevents timing attacks when user doesn't exist
  const dummyHash = '$2b$10$invalidhashfortimingprotection000000000000000000000000';
  const isValid = user
    ? await bcrypt.compare(password, user.password_hash)
    : await bcrypt.compare(password, dummyHash).then(() => false);

  if (!user || !isValid) throw new Error('Invalid credentials');

  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const { error } = await supabase.from('refresh_tokens').insert({
    token: tokens.refreshToken,
    user_id: user.id,
    expires_at: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS).toISOString(),
  });

  if (error) throw new Error(error.message);

  return tokens;
}

// ─── Refresh ─────────────────────────────────────────────────────────────────

export async function refresh(oldRefreshToken: string): Promise<AuthTokens> {
  // Throws automatically if token is expired or tampered
  const payload = verifyRefreshToken(oldRefreshToken);

  const { data: stored } = await supabase
    .from('refresh_tokens')
    .select('*')
    .eq('token', oldRefreshToken)
    .single<RefreshTokenRow>();

  if (!stored) {
    // Token already rotated — likely a reuse/theft attack
    // Invalidate ALL sessions for this user as a security measure
    await supabase.from('refresh_tokens').delete().eq('user_id', payload.userId);
    throw new Error('Refresh token reuse detected. Please log in again.');
  }

  // Rotate: delete old token first, then issue a new pair
  await supabase.from('refresh_tokens').delete().eq('token', oldRefreshToken);

  const newTokens = generateTokens({
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  });

  const { error } = await supabase.from('refresh_tokens').insert({
    token: newTokens.refreshToken,
    user_id: payload.userId,
    expires_at: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS).toISOString(),
  });

  if (error) throw new Error(error.message);

  return newTokens;
}

// ─── Logout ──────────────────────────────────────────────────────────────────

export async function logout(refreshToken: string): Promise<void> {
  // Won't throw if token doesn't exist — safe for double-logout scenarios
  await supabase.from('refresh_tokens').delete().eq('token', refreshToken);
}