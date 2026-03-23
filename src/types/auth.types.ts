export type Role = 'admin' | 'member';

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Mirrors the Supabase users table row
export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  role: Role;
  created_at: string;
}

// Mirrors the refresh_tokens table row
export interface RefreshTokenRow {
  id: string;
  token: string;
  user_id: string;
  expires_at: string;
  created_at: string;
}