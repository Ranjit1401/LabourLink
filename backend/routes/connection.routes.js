const express = require('express');
const router = express.Router();
const Connection = require('../models/Connection');

// GET all pending requests for a specific user
router.get('/pending/:userId', async (req, res) => {
  try {
    const requests = await Connection.find({ 
      receiver: req.params.userId, 
      status: 'pending' 
    }).populate('sender', 'name role location avatar');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// POST: Send a new connection request
router.post('/send', async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    const existing = await Connection.findOne({ sender: senderId, receiver: receiverId });
    if (existing) return res.status(400).json({ message: "Already sent" });

    const newConn = new Connection({ sender: senderId, receiver: receiverId });
    await newConn.save();
    res.status(201).json(newConn);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PATCH: Accept or Reject
router.patch('/update/:id', async (req, res) => {
  try {
    const updated = await Connection.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;