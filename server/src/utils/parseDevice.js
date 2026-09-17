import { UAParser } from 'ua-parser-js';

export const parseDevice = (userAgentString) => {
  if (!userAgentString) return 'unknown';

  const parser = new UAParser(userAgentString);
  const device = parser.getDevice();
  const deviceType = device.type; // 'mobile', 'tablet', 'smarttv', etc.

  if (deviceType === 'mobile') return 'mobile';
  if (deviceType === 'tablet') return 'tablet';
  if (!deviceType) {
    // Check OS to confirm desktop
    const os = parser.getOS().name;
    if (os && ['Windows', 'Mac OS', 'Linux', 'Ubuntu', 'Chromium OS'].includes(os)) {
      return 'desktop';
    }
    return 'desktop';
  }

  return 'unknown';
};
