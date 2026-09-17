import QRCode from 'qrcode';
import { Link } from '../models/Link.js';
import { ClickEvent } from '../models/ClickEvent.js';
import { generateSlug } from '../utils/generateSlug.js';
import { config } from '../config/env.js';

export const linkController = {
  // POST /api/links (Create Link with auto-slug or custom vanity alias)
  createLink: async (req, res, next) => {
    try {
      const { destinationUrl, customSlug, title } = req.body;
      const ownerId = req.user._id;

      let finalSlug;
      let isCustom = false;

      if (customSlug && customSlug.trim()) {
        const sanitizedSlug = customSlug.trim().toLowerCase();

        // Check if vanity slug format is valid
        if (!/^[a-zA-Z0-9_-]{3,50}$/.test(sanitizedSlug)) {
          return res.status(400).json({
            success: false,
            message: 'Custom slug must be 3-50 characters with letters, numbers, underscores, or hyphens.'
          });
        }

        // Detect and reject collisions (409 Conflict)
        const collision = await Link.findOne({ shortCode: sanitizedSlug });
        if (collision) {
          return res.status(409).json({
            success: false,
            message: `Custom slug '${sanitizedSlug}' is already taken. Please choose another.`
          });
        }

        finalSlug = sanitizedSlug;
        isCustom = true;
      } else {
        // Auto-generate 6-char slug with collision retry loop
        let attempts = 0;
        let generatedSlug;
        while (attempts < 5) {
          generatedSlug = generateSlug();
          const collision = await Link.findOne({ shortCode: generatedSlug });
          if (!collision) break;
          attempts++;
        }
        finalSlug = generatedSlug;
      }

      const link = await Link.create({
        owner: ownerId,
        destinationUrl,
        shortCode: finalSlug,
        title: title ? title.trim() : destinationUrl,
        isCustomAlias: isCustom,
        clickCount: 0
      });

      const shortUrl = `${config.baseUrl}/r/${link.shortCode}`;

      return res.status(201).json({
        success: true,
        message: 'Short link created successfully',
        link: {
          id: link._id,
          title: link.title,
          destinationUrl: link.destinationUrl,
          shortCode: link.shortCode,
          shortUrl,
          isCustomAlias: link.isCustomAlias,
          clickCount: link.clickCount,
          createdAt: link.createdAt
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/links (List authenticated user's links with search & pagination)
  getLinks: async (req, res, next) => {
    try {
      const ownerId = req.user._id;
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
      const search = req.query.search ? req.query.search.trim() : '';

      const query = { owner: ownerId };
      if (search) {
        query.$or = [
          { destinationUrl: { $regex: search, $options: 'i' } },
          { shortCode: { $regex: search, $options: 'i' } },
          { title: { $regex: search, $options: 'i' } }
        ];
      }

      const total = await Link.countDocuments(query);
      const links = await Link.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      const formattedLinks = links.map(link => ({
        id: link._id,
        title: link.title || link.destinationUrl,
        destinationUrl: link.destinationUrl,
        shortCode: link.shortCode,
        shortUrl: `${config.baseUrl}/r/${link.shortCode}`,
        isCustomAlias: link.isCustomAlias,
        clickCount: link.clickCount,
        createdAt: link.createdAt
      }));

      return res.status(200).json({
        success: true,
        links: formattedLinks,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/links/:id
  deleteLink: async (req, res, next) => {
    try {
      const { id } = req.params;
      const ownerId = req.user._id;

      const link = await Link.findOne({ _id: id, owner: ownerId });
      if (!link) {
        return res.status(404).json({
          success: false,
          message: 'Link not found or unauthorized to delete.'
        });
      }

      // Delete link and cascade delete its click events
      await Link.deleteOne({ _id: id });
      await ClickEvent.deleteMany({ link: id });

      return res.status(200).json({
        success: true,
        message: 'Link and associated telemetry deleted successfully.'
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/links/:id/qr (Generate high quality DataURL QR code)
  getQrCode: async (req, res, next) => {
    try {
      const { id } = req.params;
      const ownerId = req.user._id;

      const link = await Link.findOne({ _id: id, owner: ownerId });
      if (!link) {
        return res.status(404).json({
          success: false,
          message: 'Link not found.'
        });
      }

      const shortUrl = `${config.baseUrl}/r/${link.shortCode}`;
      const qrDataUrl = await QRCode.toDataURL(shortUrl, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 400,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });

      return res.status(200).json({
        success: true,
        shortUrl,
        qrDataUrl
      });
    } catch (error) {
      next(error);
    }
  }
};
