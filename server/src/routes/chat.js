const express = require('express');
const router = express.Router();
const { getChatResponse } = require('../services/ragEngine');

router.post('/query', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    const reply = await getChatResponse(message);
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process AI query' });
  }
});

module.exports = router;
