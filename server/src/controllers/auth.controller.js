import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import { tokenService } from '../utils/tokenService.js';
import { config } from '../config/env.js';

export const authController = {
  // POST /api/auth/signup
  signup: async (req, res, next) => {
    try {
      const { name, email, password, username } = req.body;

      const existingEmail = await User.findOne({ email: email.toLowerCase() });
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists.'
        });
      }

      const existingUsername = await User.findOne({ username: username.toLowerCase() });
      if (existingUsername) {
        return res.status(409).json({
          success: false,
          message: 'This username is already taken. Please choose another.'
        });
      }

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Generate verification token (expires in 24 hours)
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        passwordHash,
        isVerified: false,
        verificationToken,
        verificationTokenExpires,
        bioProfile: {
          displayName: name,
          avatarUrl: '',
          avatarPublicId: '',
          bio: `Hello! I'm ${name}. Welcome to my link-in-bio hub!`,
          theme: 'minimal-light',
          socialLinks: []
        }
      });

      // Simulated Email Delivery via Console Banner
      const verificationUrl = `${config.clientUrl}/verify-email?token=${verificationToken}`;
      console.log('\n=============================================================');
      console.log('📬 [EMAIL VERIFICATION SIMULATION]');
      console.log(`To: ${user.email} (${user.name})`);
      console.log(`Verification Token: ${verificationToken}`);
      console.log(`Verification URL: ${verificationUrl}`);
      console.log('=============================================================\n');

      return res.status(201).json({
        success: true,
        message: 'Account created! Please verify your email using the link logged to server console.',
        simulatedVerificationUrl: config.nodeEnv !== 'production' ? verificationUrl : undefined,
        verificationToken: config.nodeEnv !== 'production' ? verificationToken : undefined,
        userId: user._id
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/auth/verify-email
  verifyEmail: async (req, res, next) => {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Verification token is required.'
        });
      }

      const user = await User.findOne({
        verificationToken: token,
        verificationTokenExpires: { $gt: new Date() }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired verification token.'
        });
      }

      user.isVerified = true;
      user.verificationToken = null;
      user.verificationTokenExpires = null;
      await user.save();

      // Automatically log in user after verification
      const accessToken = tokenService.generateAccessToken(user);
      const refreshToken = tokenService.generateRefreshToken(user);
      tokenService.setRefreshTokenCookie(res, refreshToken);

      return res.status(200).json({
        success: true,
        message: 'Email successfully verified! You are now logged in.',
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          isVerified: user.isVerified,
          bioProfile: user.bioProfile
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/auth/login
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      if (!user.isVerified) {
        return res.status(403).json({
          success: false,
          message: 'Account not verified. Please verify your email first (check server console for token).'
        });
      }

      const accessToken = tokenService.generateAccessToken(user);
      const refreshToken = tokenService.generateRefreshToken(user);
      tokenService.setRefreshTokenCookie(res, refreshToken);

      return res.status(200).json({
        success: true,
        message: 'Logged in successfully.',
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          isVerified: user.isVerified,
          bioProfile: user.bioProfile
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/auth/refresh
  refresh: async (req, res, next) => {
    try {
      const existingRefreshToken = req.cookies.refreshToken;
      if (!existingRefreshToken) {
        return res.status(401).json({
          success: false,
          message: 'No refresh token provided.'
        });
      }

      const decoded = tokenService.verifyRefreshToken(existingRefreshToken);
      if (!decoded || !decoded.userId) {
        tokenService.clearRefreshTokenCookie(res);
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired refresh token.'
        });
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        tokenService.clearRefreshTokenCookie(res);
        return res.status(401).json({
          success: false,
          message: 'User no longer exists.'
        });
      }

      // Enforce refresh token version match (invalidates all sessions if version changed)
      if (decoded.tokenVersion !== user.refreshTokenVersion) {
        tokenService.clearRefreshTokenCookie(res);
        return res.status(401).json({
          success: false,
          message: 'Refresh token revoked. Please log in again.'
        });
      }

      // Token Rotation: increment version so old refresh token cannot be reused
      user.refreshTokenVersion += 1;
      await user.save();

      const newAccessToken = tokenService.generateAccessToken(user);
      const newRefreshToken = tokenService.generateRefreshToken(user);
      tokenService.setRefreshTokenCookie(res, newRefreshToken);

      return res.status(200).json({
        success: true,
        accessToken: newAccessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          isVerified: user.isVerified,
          bioProfile: user.bioProfile
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/auth/logout
  logout: async (req, res) => {
    tokenService.clearRefreshTokenCookie(res);
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.'
    });
  },

  // POST /api/auth/forgot-password
  forgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        // Return generic message to prevent email enumeration
        return res.status(200).json({
          success: true,
          message: 'If an account exists with this email, a reset link has been issued.'
        });
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await user.save();

      const resetUrl = `${config.clientUrl}/reset-password?token=${resetToken}`;
      console.log('\n=============================================================');
      console.log('🔑 [PASSWORD RESET SIMULATION]');
      console.log(`To: ${user.email}`);
      console.log(`Reset Token: ${resetToken}`);
      console.log(`Reset URL: ${resetUrl}`);
      console.log('=============================================================\n');

      return res.status(200).json({
        success: true,
        message: 'Password reset link generated. Check server console.',
        simulatedResetUrl: config.nodeEnv !== 'production' ? resetUrl : undefined,
        resetToken: config.nodeEnv !== 'production' ? resetToken : undefined
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/auth/reset-password
  resetPassword: async (req, res, next) => {
    try {
      const { token, password } = req.body;

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired password reset token.'
        });
      }

      const saltRounds = 10;
      user.passwordHash = await bcrypt.hash(password, saltRounds);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      // Increment refreshTokenVersion to invalidate all existing sessions
      user.refreshTokenVersion += 1;
      await user.save();

      tokenService.clearRefreshTokenCookie(res);

      return res.status(200).json({
        success: true,
        message: 'Password reset successfully! Please log in with your new password.'
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/auth/me
  getMe: async (req, res) => {
    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        username: req.user.username,
        isVerified: req.user.isVerified,
        bioProfile: req.user.bioProfile
      }
    });
  }
};
