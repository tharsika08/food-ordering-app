const mongoose = require('mongoose');

const workSessionSchema = new mongoose.Schema({
  date: { type: String }, // e.g. "2026-04-22"
  clockIn: { type: String }, // e.g. "09:00"
  clockOut: { type: String }, // e.g. "17:30"
  hoursWorked: { type: Number, default: 0 },
});

const deliveryPersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  photo: { type: String, default: '' },
  vehicleType: { type: String, enum: ['Bike', 'Scooter', 'Bicycle', 'Car'], default: 'Bike' },
  vehicleNumber: { type: String, default: '' },
  status: {
    type: String,
    enum: ['available', 'on_delivery', 'resting', 'off_duty'],
    default: 'available',
  },
  currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
  totalDeliveries: { type: Number, default: 0 },
  totalHoursWorked: { type: Number, default: 0 },
  rating: { type: Number, default: 4.5 },
  workSessions: [workSessionSchema],
  joinedDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('DeliveryPerson', deliveryPersonSchema);