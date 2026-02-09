const Visitor = require('../models/Visitor');

const trackVisitor = async (req, res, next) => {
  try {
    // Basic analytics capturing
    const userAgent = req.headers['user-agent'];
    const ip = req.ip || req.headers['x-forwarded-for'];
    
    // In a real app, use a GeoIP library here. Mocking for now.
    const visitorData = {
      ip,
      device: userAgent.includes('Mobile') ? 'Mobile' : 'Desktop',
      browser: userAgent.split(' ')[0],
      path: req.path
    };

    if (req.path.startsWith('/api') === false) {
        await Visitor.create(visitorData);
    }
  } catch (error) {
    console.error('Analytics track error:', error);
  }
  next();
};

module.exports = { trackVisitor };
