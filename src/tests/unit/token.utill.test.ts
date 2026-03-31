
import {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
} from '../../utils/token.util';
import { JwtPayload } from '../../types/auth.types';

describe('token.util', () => {
  const payload: JwtPayload = {
    userId: 'user-123',
    email: 'test@example.com',
    role: 'member',
  };

  it('should generate both access and refresh tokens', () => {
    const tokens = generateTokens(payload);
    expect(tokens).toHaveProperty('accessToken');
    expect(tokens).toHaveProperty('refreshToken');
    expect(typeof tokens.accessToken).toBe('string');
    expect(typeof tokens.refreshToken).toBe('string');
  });

  it('should verify a valid access token', () => {
    const { accessToken } = generateTokens(payload);
    const decoded = verifyAccessToken(accessToken);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(payload.role);
  });

  it('should verify a valid refresh token and contain jti', () => {
    const { refreshToken } = generateTokens(payload);
    const decoded = verifyRefreshToken(refreshToken);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(payload.role);
    expect(typeof decoded.jti).toBe('string');
  });

  it('should fail to verify an invalid access token', () => {
    expect(() => verifyAccessToken('invalid.token')).toThrow();
  });

  it('should fail to verify an invalid refresh token', () => {
    expect(() => verifyRefreshToken('invalid.token')).toThrow();
  });
});