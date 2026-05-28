const Telemetry = require('../models/Telemetry');

const geoCache = new Map();

async function getGeoFromIp(ip) {
  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('10.') || ip.startsWith('192.168.')) {
    return { country: 'Local', city: 'Local', lat: 0, lng: 0, isp: 'Localhost' };
  }

  if (geoCache.has(ip)) return geoCache.get(ip);

  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,lat,lon,isp,query`);
    const data = await res.json();
    if (data.status === 'success') {
      const result = { country: data.country || '', city: data.city || '', lat: data.lat || 0, lng: data.lon || 0, isp: data.isp || '' };
      geoCache.set(ip, result);
      if (geoCache.size > 1000) geoCache.clear();
      return result;
    }
  } catch {}
  return { country: '', city: '', lat: 0, lng: 0, isp: '' };
}

const telemetryMiddleware = (options = {}) => {
  return async (req, res, next) => {
    const start = Date.now();

    const originalEnd = res.end;
    res.end = function (...args) {
      const duration = Date.now() - start;
      const ip = req.ip || req.connection?.remoteAddress || req.headers['x-forwarded-for'] || '';

      const telemetryData = {
        action: options.action || req.path.split('/')[2] || 'unknown',
        endpoint: req.originalUrl || req.url,
        method: req.method,
        encryptedIp: Telemetry.encryptField(ip),
        userAgent: (req.headers['user-agent'] || '').substring(0, 255),
        anonymousId: req.headers['x-anonymous-id'] || '',
        statusCode: res.statusCode,
        duration,
        user: req.user?._id || null,
        metadata: {
          referer: req.headers['referer'] || '',
          query: Object.keys(req.query).length > 0 ? req.query : undefined,
        },
      };

      getGeoFromIp(ip).then((geo) => {
        telemetryData.country = geo.country;
        telemetryData.city = geo.city;
        telemetryData.latitude = geo.lat;
        telemetryData.longitude = geo.lng;
        telemetryData.isp = geo.isp;

        Telemetry.create(telemetryData).catch(() => {});
      });

      originalEnd.apply(this, args);
    };

    next();
  };
};

module.exports = telemetryMiddleware;
