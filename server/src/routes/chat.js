const express = require('express');
const router = express.Router();
const { getChatResponse } = require('../services/ragEngine');
const { loadResumeText } = require('../services/resumeLoader');

router.get('/resume', async (req, res) => {
  try {
    const text = await loadResumeText();
    res.json({ text });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load resume text' });
  }
});

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
