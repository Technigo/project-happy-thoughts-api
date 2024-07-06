const express = require('express');
const router = express.Router();
const Thought = require('../models/Thought'); // Assumendo che il tuo modello sia salvato in ../models/Thought.js

// Route per ottenere le ultime 20 thought
router.get('/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
