const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    name:     String,
    price:    Number,
    quantity: Number,
    image:    String
  }],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered'],
    default: 'pending'
  },
  address: { type: String, required: true },
  
  deliveryPerson: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryPerson', default: null },
  estimatedPrepTime: { type: Number, default: 15 }, // minutes
  estimatedDeliveryTime: { type: Date }, // calculated delivery time
  estimatedDeliveryMinutes: { type: Number, default: 35 } // total estimated minutes
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);