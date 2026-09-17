import crypto from 'crypto';
import { config } from '../config/env.js';

export const hashIp = (ipAddress) => {
  if (!ipAddress) return 'unknown_hash';
  // Strip IPv6-mapped IPv4 prefix if present (e.g. ::ffff:127.0.0.1)
  const cleanIp = ipAddress.replace(/^.*:/, '');
  return crypto
    .createHmac('sha256', config.ipHashSalt)
    .update(cleanIp)
    .digest('hex');
};
