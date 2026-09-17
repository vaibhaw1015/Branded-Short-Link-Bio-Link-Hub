import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'fallback_access_secret_32_chars_minimum',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_32_chars_minimum',
  ipHashSalt: process.env.IP_HASH_SALT || 'shortlink_hub_telemetry_salt',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    isConfigured: Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
  },
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  baseUrl: process.env.BASE_URL || 'http://localhost:5000'
};
