const express = require('express');
const MenuItem = require('../models/MenuItem');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all menu items (public)
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find({ available: true });
    res.json(items);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Add item (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admins only' });
    const item = await MenuItem.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Update item (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admins only' });
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Delete item (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admins only' });
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Add review to menu item
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ msg: 'Rating must be between 1 and 5' });
    }

    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: 'Menu item not found' });

    // Check if user already reviewed this item
    const existingReview = item.reviews.find(review => review.user.toString() === req.user.id);
    if (existingReview) {
      return res.status(400).json({ msg: 'You have already reviewed this item' });
    }

    // Add new review
    const newReview = {
      user: req.user.id,
      userName: req.user.name,
      rating: Number(rating),
      comment: comment || ''
    };

    item.reviews.push(newReview);

    // Recalculate average rating
    const totalRating = item.reviews.reduce((sum, review) => sum + review.rating, 0);
    item.rating = totalRating / item.reviews.length;

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get reviews for a menu item
router.get('/:id/reviews', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).select('reviews rating');
    if (!item) return res.status(404).json({ msg: 'Menu item not found' });

    res.json({
      rating: item.rating,
      reviews: item.reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Delete review (user can delete their own reviews, admin can delete any)
router.delete('/:id/reviews/:reviewId', auth, async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: 'Menu item not found' });

    const reviewIndex = item.reviews.findIndex(review =>
      review._id.toString() === req.params.reviewId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ msg: 'Review not found' });
    }

    const review = item.reviews[reviewIndex];

    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to delete this review' });
    }

    // Remove review
    item.reviews.splice(reviewIndex, 1);

    // Recalculate average rating
    if (item.reviews.length > 0) {
      const totalRating = item.reviews.reduce((sum, review) => sum + review.rating, 0);
      item.rating = totalRating / item.reviews.length;
    } else {
      item.rating = 4.5; // Default rating when no reviews
    }

    await item.save();
    res.json({ msg: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;