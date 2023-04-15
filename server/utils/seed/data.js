const mongoose = require('mongoose');
const { Bike, Timeslot, Customer, Admin, Booking } = require('./models');

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost/bike-rental', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Define the seed data
const bikes = [
  { bikeId: 'B001', bikeName: 'Mountain Bike', isAvailable: true },
  { bikeId: 'B002', bikeName: 'Road Bike', isAvailable: true },
  { bikeId: 'B003', bikeName: 'Hybrid Bike', isAvailable: true },
  { bikeId: 'B004', bikeName: 'City Bike', isAvailable: true },
  { bikeId: 'B005', bikeName: 'Electric Bike', isAvailable: true },
];

const timeslots = [
  {
    startTime: new Date('2023-04-16T08:00:00Z'),
    endTime: new Date('2023-04-16T09:00:00Z'),
    isAvailable: true,
  },
  {
    startTime: new Date('2023-04-16T09:00:00Z'),
    endTime: new Date('2023-04-16T10:00:00Z'),
    isAvailable: true,
  },
  {
    startTime: new Date('2023-04-16T10:00:00Z'),
    endTime: new Date('2023-04-16T11:00:00Z'),
    isAvailable: true,
  },
  {
    startTime: new Date('2023-04-16T11:00:00Z'),
    endTime: new Date('2023-04-16T12:00:00Z'),
    isAvailable: true,
  },
  {
    startTime: new Date('2023-04-16T12:00:00Z'),
    endTime: new Date('2023-04-16T13:00:00Z'),
    isAvailable: true,
  },
  {
    startTime: new Date('2023-04-16T13:00:00Z'),
    endTime: new Date('2023-04-16T14:00:00Z'),
    isAvailable: true,
  },
];

const customers = [
  { fullName: 'John Doe', email: 'johndoe@example.com', password: 'password' },
  {
    fullName: 'Jane Smith',
    email: 'janesmith@example.com',
    password: 'password',
  },
  {
    fullName: 'Bob Johnson',
    email: 'bobjohnson@example.com',
    password: 'password',
  },
];

const admins = [
  { fullName: 'Admin User', email: 'admin@example.com', password: 'password' },
];

// Seed the database
async function seedDatabase() {
  try {
    // Remove all existing documents from the collections
    await Bike.deleteMany({});
    await Timeslot.deleteMany({});
    await Customer.deleteMany({});
    await Admin.deleteMany({});
    await Booking.deleteMany({});

    // Insert the seed data into the collections
    const insertedBikes = await Bike.insertMany(bikes);
    const insertedTimeslots = await Timeslot.insertMany(timeslots);
    const insertedCustomers = await Customer.insertMany(customers);
    const insertedAdmins = await Admin.insertMany(admins);

    console.log(`Inserted ${insertedBikes.length} bikes`);
    console.log(`Inserted ${insertedTimeslots.length} timeslots`);
    console.log(`Inserted ${insertedCustomers.length} customers`);
    console.log(`Inserted ${insertedAdmins.length} admins`);

    // Disconnect from the database
    mongoose.disconnect();
  } catch (e) {
    console.log(e.message);
  }
}
