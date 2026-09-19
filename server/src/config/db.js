import mongoose from 'mongoose';
import { config } from './env.js';

export const connectDB = async () => {
  try {
    if (!config.mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 30000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    process.exit(1);
  }
};
