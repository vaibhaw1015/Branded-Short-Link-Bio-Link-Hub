import multer from 'multer';
import { User } from '../models/User.js';
import { Link } from '../models/Link.js';
import { cloudinary } from '../config/cloudinary.js';
import { config } from '../config/env.js';

// Multer memory storage configuration (5MB max, image only)
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, WebP, GIF) are allowed.'), false);
    }
  }
});

// Helper to upload buffer to Cloudinary stream or fallback to Data URI if credentials not configured
const uploadBufferToCloudinary = (fileBuffer, mimetype) => {
  return new Promise((resolve, reject) => {
    if (!config.cloudinary.isConfigured) {
      // Local fallback: generate high quality Data URI so app works out-of-the-box
      const base64 = fileBuffer.toString('base64');
      const dataUri = `data:${mimetype};base64,${base64}`;
      return resolve({
        secure_url: dataUri,
        public_id: `local_fallback_${Date.now()}`
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'shortlink-hub/avatars',
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          { quality: 'auto', fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

export const bioController = {
  // GET /api/bio (Get own bio profile)
  getBio: async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id).select('name username bioProfile');
      return res.status(200).json({
        success: true,
        username: user.username,
        name: user.name,
        bioProfile: user.bioProfile
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/bio (Update bio settings)
  updateBio: async (req, res, next) => {
    try {
      const { displayName, bio, theme, socialLinks } = req.body;
      const user = await User.findById(req.user._id);

      if (displayName !== undefined) user.bioProfile.displayName = displayName.trim();
      if (bio !== undefined) user.bioProfile.bio = bio.trim();
      if (theme && ['minimal-light', 'dark-slate', 'gradient'].includes(theme)) {
        user.bioProfile.theme = theme;
      }
      if (Array.isArray(socialLinks)) {
        user.bioProfile.socialLinks = socialLinks.map(link => ({
          label: link.label?.trim() || 'Link',
          url: link.url?.trim() || '',
          icon: link.icon?.trim() || 'link'
        })).filter(link => link.url);
      }

      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Bio profile updated successfully',
        bioProfile: user.bioProfile
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/bio/avatar (Multipart image upload)
  uploadAvatar: async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file uploaded.'
        });
      }

      const user = await User.findById(req.user._id);

      // If user already has an avatar on Cloudinary, delete it to prevent orphaned assets
      if (user.bioProfile?.avatarPublicId && !user.bioProfile.avatarPublicId.startsWith('local_fallback_')) {
        if (config.cloudinary.isConfigured) {
          try {
            await cloudinary.uploader.destroy(user.bioProfile.avatarPublicId);
          } catch (err) {
            console.warn(`[Cloudinary] Failed to delete previous avatar: ${err.message}`);
          }
        }
      }

      // Stream upload incoming buffer
      const result = await uploadBufferToCloudinary(req.file.buffer, req.file.mimetype);

      user.bioProfile.avatarUrl = result.secure_url;
      user.bioProfile.avatarPublicId = result.public_id;
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Avatar uploaded successfully!',
        avatarUrl: user.bioProfile.avatarUrl,
        avatarPublicId: user.bioProfile.avatarPublicId
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/bio/:username (Public bio page data - no authentication needed)
  getPublicBio: async (req, res, next) => {
    try {
      const { username } = req.params;
      const user = await User.findOne({ username: username.toLowerCase() })
        .select('name username bioProfile');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: `User '@${username}' not found.`
        });
      }

      // Also fetch user's public shortened links to display on their bio hub
      const links = await Link.find({ owner: user._id })
        .sort({ createdAt: -1 })
        .limit(25)
        .select('title destinationUrl shortCode clickCount')
        .lean();

      const formattedLinks = links.map(link => ({
        id: link._id,
        title: link.title || link.destinationUrl,
        shortCode: link.shortCode,
        shortUrl: `${config.baseUrl}/r/${link.shortCode}`,
        destinationUrl: link.destinationUrl,
        clickCount: link.clickCount
      }));

      return res.status(200).json({
        success: true,
        user: {
          name: user.name,
          username: user.username,
          displayName: user.bioProfile.displayName || user.name,
          avatarUrl: user.bioProfile.avatarUrl,
          bio: user.bioProfile.bio,
          theme: user.bioProfile.theme,
          socialLinks: user.bioProfile.socialLinks || []
        },
        links: formattedLinks
      });
    } catch (error) {
      next(error);
    }
  }
};
