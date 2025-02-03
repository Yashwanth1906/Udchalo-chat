const FLIGHTS = [
  {
    id: 'FL001',
    from: 'DEL',
    to: 'BOM',
    airline: 'Air India',
    flightNumber: 'AI101',
    departure: '10:00 AM',
    arrival: '12:00 PM',
    price: '₹4,500',
    date: '2024-03-20',
    available: true,
  },
  {
    id: 'FL002',
    from: 'BLR',
    to: 'DEL',
    airline: 'IndiGo',
    flightNumber: '6E234',
    departure: '2:30 PM',
    arrival: '5:00 PM',
    price: '₹5,200',
    date: '2024-03-20',
    available: true,
  },
  // Add more flights...
];

const HOLIDAYS = [
  {
    id: 'H001',
    destination: 'Goa Package',
    duration: '3 Nights / 4 Days',
    price: '₹15,000',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2',
    rating: 4.5,
  },
  // Add more holiday packages...
];

const PRODUCTS = {
  electronics: [
    {
      id: 'E001',
      name: 'Smart Watch',
      price: '₹2,999',
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12',
    },
    // Add more electronics...
  ],
  clothing: [
    {
      id: 'C001',
      name: 'Military Jacket',
      price: '₹1,499',
      rating: 4.1,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5',
    },
    // Add more clothing...
  ],
};

const DATA = { FLIGHTS, HOLIDAYS, PRODUCTS };

export default DATA;
