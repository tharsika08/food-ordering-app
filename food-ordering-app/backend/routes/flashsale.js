const express = require('express');
const router  = express.Router();
const FlashSale = require('../models/FlashSale');
const MenuItem  = require('../models/MenuItem');
const auth      = require('../middleware/auth');

// GET active flash sale (public)
router.get('/active', async (req, res) => {
  try {
    const now  = new Date();
    const sale = await FlashSale.findOne({ isActive: true, endTime: { $gt: now } })
      .sort('-createdAt');
    res.json(sale || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all flash sales (admin)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admins only' });
    const sales = await FlashSale.find().sort('-createdAt');
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create flash sale (admin)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admins only' });
    const { menuItemId, salePrice, name, description, image, originalPrice } = req.body;

    // Deactivate any existing active sale first
    await FlashSale.updateMany({ isActive: true }, { isActive: false });

    const endTime  = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    const discount = Math.round(((originalPrice - salePrice) / originalPrice) * 100);

    const sale = await FlashSale.create({
      menuItem: menuItemId,
      name, description, image,
      originalPrice, salePrice, discount,
      endTime,
      createdBy: req.user.id,
      isActive: true,
    });
    res.status(201).json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE / deactivate flash sale (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admins only' });
    await FlashSale.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Flash sale ended' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;