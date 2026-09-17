import { Link } from '../models/Link.js';
import { ClickEvent } from '../models/ClickEvent.js';
import { hashIp } from '../utils/hashIp.js';
import { parseDevice } from '../utils/parseDevice.js';

/**
 * Asynchronous click telemetry recorder.
 * Must run fire-and-forget without blocking the HTTP 302 redirect response.
 */
const recordClickTelemetryAsync = (linkId, clientIp, userAgent, rawReferrer) => {
  setImmediate(async () => {
    try {
      const ipHash = hashIp(clientIp);
      const deviceType = parseDevice(userAgent);

      // Clean referrer: direct traffic if empty
      let referrer = 'Direct';
      if (rawReferrer) {
        try {
          const parsed = new URL(rawReferrer);
          referrer = parsed.hostname.replace(/^www\./, '');
        } catch {
          referrer = rawReferrer.substring(0, 100);
        }
      }

      // 1. Create ClickEvent record
      await ClickEvent.create({
        link: linkId,
        timestamp: new Date(),
        referrer,
        deviceType,
        ipHash
      });

      // 2. Atomically increment Link denormalized clickCount
      await Link.updateOne({ _id: linkId }, { $inc: { clickCount: 1 } });
    } catch (err) {
      // Fire-and-forget: logging errors should never throw or break redirect
      console.error(`[Telemetry Error] Failed to log click for link ${linkId}: ${err.message}`);
    }
  });
};

export const redirectController = {
  // GET /r/:shortCode
  redirect: async (req, res, next) => {
    try {
      const { shortCode } = req.params;

      if (!shortCode) {
        return res.status(404).send('Short link not found');
      }

      // Fast indexed shortCode lookup
      const link = await Link.findOne({ shortCode }).select('destinationUrl _id').lean();

      if (!link) {
        return res.status(404).json({
          success: false,
          message: 'The requested short link was not found or has expired.'
        });
      }

      // Extract telemetry information before sending response
      const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || '';
      const userAgent = req.headers['user-agent'] || '';
      const referrer = req.headers['referer'] || req.headers['referrer'] || '';

      // Respond immediately with HTTP 302 Found
      res.redirect(302, link.destinationUrl);

      // Non-blocking fire-and-forget telemetry logging
      recordClickTelemetryAsync(link._id, clientIp, userAgent, referrer);
    } catch (error) {
      next(error);
    }
  }
};
