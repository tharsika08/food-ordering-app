const mongoose = require('mongoose');

const flashSaleSchema = new mongoose.Schema({
  menuItem:    { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name:        { type: String, required: true },
  description: { type: String },
  image:       { type: String },
  originalPrice: { type: Number, required: true },
  salePrice:   { type: Number, required: true },
  discount:    { type: Number, required: true },
  startTime:   { type: Date, default: Date.now },
  endTime:     { type: Date, required: true },
  isActive:    { type: Boolean, default: true },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('FlashSale', flashSaleSchema);