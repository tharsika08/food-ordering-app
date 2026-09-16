const mongoose = require('mongoose');
const DeliveryPerson = require('./models/DeliveryPerson');
require('dotenv').config();

const deliveryPersons = [
  { name: 'Arun Kumar', phone: '9876543210', email: 'arun@foodapp.com', vehicleType: 'Bike', vehicleNumber: 'TN 01 AB 1234', status: 'available', totalDeliveries: 142, totalHoursWorked: 320, rating: 4.8, joinedDate: new Date('2024-01-10'), workSessions: [{ date: '2026-04-20', clockIn: '09:00', clockOut: '17:00', hoursWorked: 8 }, { date: '2026-04-21', clockIn: '09:30', clockOut: '18:00', hoursWorked: 8.5 }, { date: '2026-04-22', clockIn: '08:45', clockOut: '', hoursWorked: 0 }] },
  { name: 'Murugan S', phone: '9876501234', email: 'murugan@foodapp.com', vehicleType: 'Scooter', vehicleNumber: 'TN 02 CD 5678', status: 'on_delivery', totalDeliveries: 98, totalHoursWorked: 210, rating: 4.5, joinedDate: new Date('2024-03-15'), workSessions: [{ date: '2026-04-20', clockIn: '10:00', clockOut: '18:30', hoursWorked: 8.5 }, { date: '2026-04-21', clockIn: '10:00', clockOut: '19:00', hoursWorked: 9 }, { date: '2026-04-22', clockIn: '09:00', clockOut: '', hoursWorked: 0 }] },
  { name: 'Karthik R', phone: '9876509876', email: 'karthik@foodapp.com', vehicleType: 'Bike', vehicleNumber: 'TN 03 EF 9012', status: 'resting', totalDeliveries: 203, totalHoursWorked: 450, rating: 4.9, joinedDate: new Date('2023-11-01'), workSessions: [{ date: '2026-04-20', clockIn: '08:00', clockOut: '16:00', hoursWorked: 8 }, { date: '2026-04-21', clockIn: '08:00', clockOut: '17:00', hoursWorked: 9 }, { date: '2026-04-22', clockIn: '08:00', clockOut: '', hoursWorked: 0 }] },
  { name: 'Senthil V', phone: '9876512345', email: 'senthil@foodapp.com', vehicleType: 'Bicycle', vehicleNumber: 'N/A', status: 'off_duty', totalDeliveries: 55, totalHoursWorked: 120, rating: 4.3, joinedDate: new Date('2025-06-20'), workSessions: [{ date: '2026-04-19', clockIn: '11:00', clockOut: '19:00', hoursWorked: 8 }, { date: '2026-04-20', clockIn: '11:00', clockOut: '20:00', hoursWorked: 9 }] },
  { name: 'Pradeep M', phone: '9876598765', email: 'pradeep@foodapp.com', vehicleType: 'Bike', vehicleNumber: 'TN 04 GH 3456', status: 'available', totalDeliveries: 178, totalHoursWorked: 390, rating: 4.7, joinedDate: new Date('2024-02-14'), workSessions: [{ date: '2026-04-20', clockIn: '09:00', clockOut: '17:30', hoursWorked: 8.5 }, { date: '2026-04-21', clockIn: '09:00', clockOut: '18:00', hoursWorked: 9 }, { date: '2026-04-22', clockIn: '09:15', clockOut: '', hoursWorked: 0 }] },
  { name: 'Deepa T', phone: '9876567890', email: 'deepa@foodapp.com', vehicleType: 'Scooter', vehicleNumber: 'TN 05 IJ 7890', status: 'on_delivery', totalDeliveries: 76, totalHoursWorked: 170, rating: 4.6, joinedDate: new Date('2025-01-05'), workSessions: [{ date: '2026-04-20', clockIn: '10:30', clockOut: '18:30', hoursWorked: 8 }, { date: '2026-04-21', clockIn: '10:00', clockOut: '19:00', hoursWorked: 9 }, { date: '2026-04-22', clockIn: '10:00', clockOut: '', hoursWorked: 0 }] },
];

async function seedDeliveryPersons() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    await DeliveryPerson.deleteMany({});
    console.log('Cleared existing delivery persons');
    await DeliveryPerson.insertMany(deliveryPersons);
    console.log(`✅ Seeded ${deliveryPersons.length} delivery persons`);
    mongoose.disconnect();
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seedDeliveryPersons();