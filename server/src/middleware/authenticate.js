import { tokenService } from '../utils/tokenService.js';
import { User } from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token required. Please log in.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = tokenService.verifyAccessToken(token);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired access token. Please refresh token.'
      });
    }

    const user = await User.findById(decoded.userId).select('-passwordHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication error: ' + error.message
    });
  }
};
