import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const tokenService = {
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        username: user.username
      },
      config.jwtAccessSecret,
      { expiresIn: '15m' }
    );
  },

  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        userId: user._id.toString(),
        tokenVersion: user.refreshTokenVersion
      },
      config.jwtRefreshSecret,
      { expiresIn: '7d' }
    );
  },

  verifyAccessToken: (token) => {
    try {
      return jwt.verify(token, config.jwtAccessSecret);
    } catch (err) {
      return null;
    }
  },

  verifyRefreshToken: (token) => {
    try {
      return jwt.verify(token, config.jwtRefreshSecret);
    } catch (err) {
      return null;
    }
  },

  setRefreshTokenCookie: (res, token) => {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  },

  clearRefreshTokenCookie: (res) => {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: config.nodeEnv === 'production' ? 'none' : 'lax'
    });
  }
};
