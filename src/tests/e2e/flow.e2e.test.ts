import request from 'supertest';
import app from '../../index'; // Adjust path if needed
import { supabase } from '../../lib/supabase';

describe('E2E Auth Flow (real DB)', () => {
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  afterAll(async () => {
    // Clean up: delete the test user from the DB
    await supabase.from('users').delete().eq('email', testEmail);
  });

    it('registers a new user (real DB)', async () => {
    const res = await request(app)
        .post('/auth/register')
        .send({ email: testEmail, password: testPassword });
    console.log('Register response:', res.status, res.body); // Add this line
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('email', testEmail);
    });

  it('logs in with the new user (real DB)', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: testEmail, password: testPassword });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });
});