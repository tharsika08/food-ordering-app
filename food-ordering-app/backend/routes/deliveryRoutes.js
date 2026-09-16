const express = require('express');
const router = express.Router();
const DeliveryPerson = require('../models/DeliveryPerson');

// GET all delivery persons
router.get('/', async (req, res) => {
  try {
    const persons = await DeliveryPerson.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(persons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single delivery person
router.get('/:id', async (req, res) => {
  try {
    const person = await DeliveryPerson.findById(req.params.id);
    if (!person) return res.status(404).json({ error: 'Not found' });
    res.json(person);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new delivery person
router.post('/', async (req, res) => {
  try {
    const person = new DeliveryPerson(req.body);
    await person.save();
    res.status(201).json(person);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH update status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const person = await DeliveryPerson.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(person);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH clock in
router.patch('/:id/clockin', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const clockIn = new Date().toTimeString().slice(0, 5);
    const person = await DeliveryPerson.findById(req.params.id);

    const existing = person.workSessions.find(s => s.date === today);
    if (existing && existing.clockIn) {
      return res.status(400).json({ error: 'Already clocked in today' });
    }

    person.workSessions.push({ date: today, clockIn, clockOut: '', hoursWorked: 0 });
    person.status = 'available';
    await person.save();
    res.json(person);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH clock out
router.patch('/:id/clockout', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const clockOut = new Date().toTimeString().slice(0, 5);
    const person = await DeliveryPerson.findById(req.params.id);

    const session = person.workSessions.find(s => s.date === today && !s.clockOut);
    if (!session) return res.status(400).json({ error: 'No active session today' });

    const [inH, inM] = session.clockIn.split(':').map(Number);
    const [outH, outM] = clockOut.split(':').map(Number);
    const hoursWorked = parseFloat(((outH * 60 + outM - inH * 60 - inM) / 60).toFixed(2));

    session.clockOut = clockOut;
    session.hoursWorked = hoursWorked;
    person.totalHoursWorked += hoursWorked;
    person.status = 'off_duty';
    await person.save();
    res.json(person);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    await DeliveryPerson.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── NEW: Clear all work sessions ─────────────────────────────
router.patch('/:id/clearsessions', async (req, res) => {
  try {
    const person = await DeliveryPerson.findByIdAndUpdate(
      req.params.id,
      { workSessions: [] },
      { new: true }
    );
    res.json(person);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;