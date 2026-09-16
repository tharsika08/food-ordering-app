const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String },
  price:       { type: Number, required: true },
  category:    { type: String, required: true },
  image:       { type: String, default: '' },
  available:   { type: Boolean, default: true },
  rating:      { type: Number, default: 4.5, min: 0, max: 5 },
  discount:    { type: Number, default: 0, min: 0, max: 100 }, // Percentage discount
  isSpecial:   { type: Boolean, default: false }, // Special offer flag
  reviews:     [{
    user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName:  String,
    rating:    { type: Number, min: 1, max: 5 },
    comment:   String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', MenuItemSchema);