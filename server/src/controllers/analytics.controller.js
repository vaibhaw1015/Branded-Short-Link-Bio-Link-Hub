import mongoose from 'mongoose';
import { Link } from '../models/Link.js';
import { ClickEvent } from '../models/ClickEvent.js';

export const analyticsController = {
  // GET /api/links/:id/analytics (per-link analytics)
  getLinkAnalytics: async (req, res, next) => {
    try {
      const { id } = req.params;
      const ownerId = req.user._id;

      const link = await Link.findOne({ _id: id, owner: ownerId });
      if (!link) {
        return res.status(404).json({
          success: false,
          message: 'Link not found or unauthorized.'
        });
      }

      const linkObjectId = new mongoose.Types.ObjectId(id);

      // 1. Time-series clicks over time (daily bucketing)
      const clicksOverTime = await ClickEvent.aggregate([
        { $match: { link: linkObjectId } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
            },
            clicks: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            date: '$_id',
            clicks: 1
          }
        }
      ]);

      // 2. Top referrers (ranked list)
      const topReferrers = await ClickEvent.aggregate([
        { $match: { link: linkObjectId } },
        {
          $group: {
            _id: { $ifNull: ['$referrer', 'Direct'] },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 0,
            referrer: '$_id',
            count: 1
          }
        }
      ]);

      // 3. Device-type breakdown (mobile, desktop, tablet, unknown)
      const deviceBreakdown = await ClickEvent.aggregate([
        { $match: { link: linkObjectId } },
        {
          $group: {
            _id: { $ifNull: ['$deviceType', 'unknown'] },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        {
          $project: {
            _id: 0,
            device: '$_id',
            count: 1
          }
        }
      ]);

      // Total telemetry click count
      const totalRecordedClicks = await ClickEvent.countDocuments({ link: linkObjectId });

      return res.status(200).json({
        success: true,
        link: {
          id: link._id,
          title: link.title,
          destinationUrl: link.destinationUrl,
          shortCode: link.shortCode,
          shortUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/r/${link.shortCode}`,
          clickCount: link.clickCount,
          createdAt: link.createdAt
        },
        analytics: {
          totalClicks: totalRecordedClicks,
          clicksOverTime,
          topReferrers,
          deviceBreakdown
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/analytics/overview (Aggregate across all user links)
  getOverviewAnalytics: async (req, res, next) => {
    try {
      const ownerId = req.user._id;

      // Find all link IDs belonging to user
      const userLinks = await Link.find({ owner: ownerId }).select('_id clickCount title shortCode').lean();
      const linkIds = userLinks.map(l => l._id);

      if (linkIds.length === 0) {
        return res.status(200).json({
          success: true,
          totalLinks: 0,
          totalClicks: 0,
          clicksOverTime: [],
          topReferrers: [],
          deviceBreakdown: []
        });
      }

      const totalClicks = userLinks.reduce((acc, l) => acc + (l.clickCount || 0), 0);

      // Clicks over time across all links
      const clicksOverTime = await ClickEvent.aggregate([
        { $match: { link: { $in: linkIds } } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
            },
            clicks: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            date: '$_id',
            clicks: 1
          }
        }
      ]);

      // Top referrers across all links
      const topReferrers = await ClickEvent.aggregate([
        { $match: { link: { $in: linkIds } } },
        {
          $group: {
            _id: { $ifNull: ['$referrer', 'Direct'] },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 0,
            referrer: '$_id',
            count: 1
          }
        }
      ]);

      // Device breakdown across all links
      const deviceBreakdown = await ClickEvent.aggregate([
        { $match: { link: { $in: linkIds } } },
        {
          $group: {
            _id: { $ifNull: ['$deviceType', 'unknown'] },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        {
          $project: {
            _id: 0,
            device: '$_id',
            count: 1
          }
        }
      ]);

      return res.status(200).json({
        success: true,
        totalLinks: userLinks.length,
        totalClicks,
        clicksOverTime,
        topReferrers,
        deviceBreakdown
      });
    } catch (error) {
      next(error);
    }
  }
};
