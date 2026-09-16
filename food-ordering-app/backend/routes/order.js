const express = require('express');
const Order = require('../models/Order');
const DeliveryPerson = require('../models/DeliveryPerson');
const auth = require('../middleware/auth');

const router = express.Router();

// Place order
router.post('/', auth, async (req, res) => {
  try {
    const { items, address, totalAmount, deliveryPerson } = req.body;
    const finalAmount = totalAmount || items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const basePrepTime = 15, timePerItem = 2, deliveryTime = 20;
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const estimatedPrepTime = basePrepTime + (timePerItem * totalItems);
    const estimatedDeliveryMinutes = estimatedPrepTime + deliveryTime;
    const estimatedDeliveryTime = new Date(Date.now() + estimatedDeliveryMinutes * 60000);
    const order = await Order.create({
      user: req.user.id, items, totalAmount: finalAmount, address,
      estimatedPrepTime, estimatedDeliveryTime, estimatedDeliveryMinutes,
      deliveryPerson: deliveryPerson || null
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get my orders
router.get('/mine', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get all orders (admin)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admins only' });
    const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ── Update order status (admin) ──────────────────────────────
// AUTO: when status → delivered, increment delivery person's totalDeliveries
router.patch('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admins only' });

    const { status } = req.body;

    // Fetch the existing order before updating
    const existingOrder = await Order.findById(req.params.id);
    if (!existingOrder) return res.status(404).json({ msg: 'Order not found' });

    // Update the order
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

    // ── AUTO UPDATE: if status just changed TO delivered ──
    if (status === 'delivered' && existingOrder.status !== 'delivered') {
      if (existingOrder.deliveryPerson) {
        // Increment totalDeliveries for the assigned delivery person
        await DeliveryPerson.findByIdAndUpdate(
          existingOrder.deliveryPerson,
          { $inc: { totalDeliveries: 1 } }
        );
      }
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ── DELETE ROUTES ────────────────────────────────────────────

router.delete('/clear/delivered', auth, async (req, res) => {
  try {
    const result = await Order.deleteMany({ user: req.user.id, status: 'delivered' });
    res.json({ message: `${result.deletedCount} delivered order(s) cleared` });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.delete('/clear/all', auth, async (req, res) => {
  try {
    const result = await Order.deleteMany({ user: req.user.id });
    res.json({ message: `${result.deletedCount} order(s) cleared` });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    await order.deleteOne();
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ── ADMIN DELETE ROUTES ──────────────────────────────────────

router.delete('/admin/clear/delivered', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admins only' });
    const result = await Order.deleteMany({ status: 'delivered' });
    res.json({ message: `${result.deletedCount} delivered order(s) cleared` });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.delete('/admin/clear/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admins only' });
    const result = await Order.deleteMany({});
    res.json({ message: `${result.deletedCount} order(s) cleared` });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.delete('/admin/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admins only' });
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;