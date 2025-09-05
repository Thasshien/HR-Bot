const express = require('express');
const router = express.Router();
const Request = require('../models/Request');

// Create a new request (from employee)
router.post('/', async (req, res) => {
  try {
    const newRequest = new Request({
      employeeId: req.body.employeeId,
      type: req.body.type,
      SLA_hours: req.body.SLA_hours || 24,  // default SLA 24h
      status: 'pending'
    });
    const saved = await newRequest.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all requests (optional)
router.get('/', async (req, res) => {
  try {
    const requests = await Request.find();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get SLA breaches (for HR dashboard)
router.get('/slabreaches', async (req, res) => {
  try {
    const pending = await Request.find({ status: 'pending', escalated: false });
    const breached = pending.filter(req => {
      const hoursElapsed = (Date.now() - req.createdAt) / (1000 * 60 * 60);
      return hoursElapsed > req.SLA_hours;
    });
    res.json(breached);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;