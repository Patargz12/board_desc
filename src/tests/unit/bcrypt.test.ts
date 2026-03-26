import bcrypt from 'bcrypt';

describe('bcrypt hashing and comparison', () => {
  const password = 'mySecretPassword';
  let hash: string;

  it('should hash a password', async () => {
    hash = await bcrypt.hash(password, 10);
    expect(typeof hash).toBe('string');
    expect(hash).not.toBe(password);
  });

  it('should compare a correct password successfully', async () => {
    const isMatch = await bcrypt.compare(password, hash);
    expect(isMatch).toBe(true);
  });

  it('should fail comparison with incorrect password', async () => {
    const isMatch = await bcrypt.compare('wrongPassword', hash);
    expect(isMatch).toBe(false);
  });
});