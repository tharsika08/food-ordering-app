const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
require('dotenv').config();

const items = [
  {
    name: 'Masala Dosa',
    description: 'Crispy rice dosa stuffed with spicy potato masala, served with sambar & chutneys',
    price: 119,
    category: 'South Indian',
    image: '/images/masala-dosa.jpg',
    available: true, rating: 4.9, discount: 10, isSpecial: true
  },
  {
    name: 'Rava Dosa',
    description: 'Thin, crisp semolina dosa with curry leaves and green chilies',
    price: 99,
    category: 'South Indian',
    image: '/images/masala-dosa.jpg',
    available: true, rating: 4.7, discount: 0, isSpecial: false
  },
  {
    name: 'Paper Dosa',
    description: 'Extra-large paper-thin dosa, served with sambar and coconut chutney',
    price: 129,
    category: 'South Indian',
    image: '/images/masala-dosa.jpg',
    available: true, rating: 4.8, discount: 0, isSpecial: false
  },
  {
    name: 'Idli (4 pcs)',
    description: 'Soft steamed rice cakes served with sambar and two chutneys',
    price: 79,
    category: 'South Indian',
    image: '/images/idli.jpg',
    available: true, rating: 4.7, discount: 0, isSpecial: false
  },
  {
    name: 'Medu Vada (2 pcs)',
    description: 'Crispy lentil donuts served with sambar and coconut chutney',
    price: 69,
    category: 'South Indian',
    image: '/images/medu-vada.jpg',
    available: true, rating: 4.8, discount: 0, isSpecial: false
  },
  {
    name: 'Uttapam',
    description: 'Thick pancake with onions, tomatoes, chilies, and coriander',
    price: 109,
    category: 'South Indian',
    image: '/images/uttapam.jpg',
    available: true, rating: 4.6, discount: 0, isSpecial: false
  },
  {
    name: 'Rasam',
    description: 'Tangy pepper-tomato soup with aromatics and curry leaves',
    price: 59,
    category: 'South Indian',
    image: '/images/sambar.jpg',
    available: true, rating: 4.5, discount: 0, isSpecial: false
  },
  {
    name: 'Sambar',
    description: 'Lentil stew with vegetables and spices, perfect for idli/dosa',
    price: 69,
    category: 'South Indian',
    image: '/images/sambar.jpg',
    available: true, rating: 4.7, discount: 0, isSpecial: false
  },
  {
    name: 'Coconut Chutney',
    description: 'Fresh coconut chutney with green chilies and tempered mustard seeds',
    price: 29,
    category: 'Sides',
    image: '/images/coconut-chutney.jpg',
    available: true, rating: 4.8, discount: 0, isSpecial: false
  },
  {
    name: 'Pongal',
    description: 'Savory rice and moong dal dish garnished with ghee, cashew, and pepper',
    price: 99,
    category: 'South Indian',
    image: '/images/pongal.jpg',
    available: true, rating: 4.4, discount: 0, isSpecial: false
  },
  {
    name: 'Filter Coffee',
    description: 'Strong South Indian filter coffee with foamed milk',
    price: 49,
    category: 'Beverages',
    image: '/images/filter-coffee.jpg',
    available: true, rating: 4.9, discount: 0, isSpecial: false
  },
  {
    name: 'Mysore Masala Dosa',
    description: 'Spicy chutney spread dosa with potato masala',
    price: 139,
    category: 'South Indian',
    image: '/images/masala-dosa.jpg',
    available: true, rating: 4.8, discount: 0, isSpecial: true
  },
  {
    name: 'Set Dosa',
    description: 'Three soft mini dosa with coconut chutney and sambar',
    price: 119,
    category: 'South Indian',
    image: '/images/masala-dosa.jpg',
    available: true, rating: 4.6, discount: 0, isSpecial: false
  },
  {
    name: 'Idli Sambhar Combo',
    description: '4 soft idli with sambhar and chutneys',
    price: 99,
    category: 'South Indian',
    image: '/images/idli.jpg',
    available: true, rating: 4.8, discount: 0, isSpecial: false
  },
  {
    name: 'Medu Vada Sambar',
    description: '2 crisp vada served with sambar and chutney',
    price: 79,
    category: 'South Indian',
    image: '/images/medu-vada.jpg',
    available: true, rating: 4.7, discount: 0, isSpecial: false
  },
  {
    name: 'Onion Uttapam',
    description: 'Thick uttapam topped with onions, tomatoes and chilies',
    price: 109,
    category: 'South Indian',
    image: '/images/uttapam.jpg',
    available: true, rating: 4.6, discount: 0, isSpecial: false
  },
  {
    name: 'Ghee Pongal',
    description: 'Warm sweet pongal with ghee and cardamom',
    price: 89,
    category: 'South Indian',
    image: '/images/pongal.jpg',
    available: true, rating: 4.5, discount: 0, isSpecial: false
  },
  {
    name: 'Payasam',
    description: 'Traditional sweet rice pudding with nuts and saffron',
    price: 79,
    category: 'Desserts',
    image: '/images/payasam.jpg',
    available: true, rating: 4.7, discount: 0, isSpecial: false
  },
  {
    name: 'Kesari Bath',
    description: 'Sweet semolina dessert flavored with saffron and ghee',
    price: 89,
    category: 'Desserts',
    image: '/images/payasam.jpg',
    available: true, rating: 4.7, discount: 0, isSpecial: false
  },
  {
    name: 'Tandoori Roti',
    description: 'Soft whole wheat roti with tandoori flavor',
    price: 39,
    category: 'Breads',
    image: '/images/roti.jpg',
    available: true, rating: 4.6, discount: 0, isSpecial: false
  },
  {
    name: 'Vegetable Kurma',
    description: 'Mixed vegetables in creamy coconut gravy',
    price: 209,
    category: 'Curries',
    image: '/images/veg-kurma.jpg',
    available: true, rating: 4.6, discount: 0, isSpecial: false
  }
];

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Clear existing items
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items');

    // Insert new items
    await MenuItem.insertMany(items);
    console.log('✅ Menu items seeded successfully!');

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedData();