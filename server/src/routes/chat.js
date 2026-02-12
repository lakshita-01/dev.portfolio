const express = require('express');
const router = express.Router();
const { getChatResponse } = require('../services/ragEngine');

router.post('/query', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    const reply = await getChatResponse(message);
    if (reply === "Unable to respond right now. Please try again later.") {
      return res.status(503).json({ error: 'AI Service temporarily unavailable' });
    }
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process AI query' });
  }
});

module.exports = router;
