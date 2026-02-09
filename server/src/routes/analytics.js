const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');

router.get('/stats', async (req, res) => {
  try {
    const totalVisits = await Visitor.countDocuments();
    const uniqueIPs = await Visitor.distinct('ip');
    const recentActivity = await Visitor.find().sort({ timestamp: -1 }).limit(10);
    
    // Group by day for simple chart data
    const chartData = await Visitor.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          visits: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } },
      { $limit: 7 }
    ]);

    res.json({
      totalVisits,
      uniqueVisitors: uniqueIPs.length,
      recentActivity,
      chartData
    });
  } catch (error) {
    res.status(500).json({ error: 'Analytics fetch failed' });
  }
});

module.exports = router;
