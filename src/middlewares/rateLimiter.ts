import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import type { RedisReply } from 'rate-limit-redis'; // 👈 import the type
import redisClient from '../lib/redis';

export const authRateLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (command: string, ...args: string[]) =>
      redisClient.call(command, ...args) as Promise<RedisReply>, // 👈 cast to RedisReply
  }),
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => {
    const email = req.body?.email;
    let ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (Array.isArray(ip)) ip = ip[0];
    if (typeof ip !== 'string') ip = '';
    if (!ip) ip = 'unknown';
    return email ? `${ip}:${email}` : ip;
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many attempts. Try again later.' });
  },
});