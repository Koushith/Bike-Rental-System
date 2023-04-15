// Import required modules
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

// Import data models
import Bike from './models/bike';
import Timeslot from './models/timeslot';
import Customer from './models/customer';
import Admin from './models/admin';
import Booking from './models/booking';

// Create Express app
const app = express();

// Configure body-parser middleware for parsing request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost/bike-rental', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error(`Failed to connect to MongoDB: ${err}`);
  });

// Define API endpoints

// GET /api/bikes - Retrieve all available bikes
app.get('/api/bikes', async (req, res) => {
  try {
    const bikes = await Bike.find({ status: 'available' });
    res.status(200).json(bikes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve bikes' });
  }
});

// GET /api/timeslots - Retrieve all available timeslots
app.get('/api/timeslots', async (req, res) => {
  try {
    const timeslots = await Timeslot.find({ status: 'available' });
    res.status(200).json(timeslots);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve timeslots' });
  }
});

// POST /api/bookings - Create a new booking
app.post('/api/bookings', async (req, res) => {
  try {
    // Extract request body parameters
    const { customerId, bikeId, timeslotId, startTime, endTime } = req.body;

    // Check if the bike and timeslot are available
    const bike = await Bike.findOne({ _id: bikeId, status: 'available' });
    const timeslot = await Timeslot.findOne({
      _id: timeslotId,
      status: 'available',
    });

    if (!bike || !timeslot) {
      res.status(400).json({ error: 'Bike or timeslot is not available' });
    } else {
      // Create a new booking
      const booking = new Booking({
        customerId,
        bikeId,
        timeslotId,
        startTime,
        endTime,
      });
      await booking.save();

      // Update bike and timeslot status to booked
      bike.status = 'booked';
      timeslot.status = 'booked';
      await bike.save();
      await timeslot.save();

      res
        .status(201)
        .json({ message: 'Booking created successfully', booking });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// GET /api/customers/:customerId/bookings - Retrieve all bookings for a customer
app.get('/api/customers/:customerId/bookings', async (req, res) => {
  try {
    const { customerId } = req.params;
    const bookings = await Booking.find({ customerId });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve bookings' });
  }
});

// GET /api/admins/:adminId/bookings - Retrieve all bookings for an admin
// GET /api/admins/:adminId/bookings - Retrieve all bookings for an admin
app.get('/api/admins/:adminId/bookings', async (req, res) => {
  try {
    const { adminId } = req.params;
    const bookings = await Booking.find({ adminId });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve bookings' });
  }
});

// PUT /api/bookings/:bookingId - Update a booking status
app.put('/api/bookings/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    // Check if the booking exists
    const booking = await Booking.findOne({ _id: bookingId });
    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
    } else {
      // Update booking status
      booking.status = status;
      await booking.save();

      // Update bike and timeslot status based on booking status
      const bike = await Bike.findOne({ _id: booking.bikeId });
      const timeslot = await Timeslot.findOne({ _id: booking.timeslotId });
      if (status === 'cancelled') {
        bike.status = 'available';
        timeslot.status = 'available';
      } else if (status === 'completed') {
        bike.status = 'completed';
        timeslot.status = 'completed';
      }
      await bike.save();
      await timeslot.save();

      res
        .status(200)
        .json({ message: 'Booking status updated successfully', booking });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

// DELETE /api/bookings/:bookingId - Delete a booking
app.delete('/api/bookings/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Check if the booking exists
    const booking = await Booking.findOne({ _id: bookingId });
    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
    } else {
      // Update bike and timeslot status to available
      const bike = await Bike.findOne({ _id: booking.bikeId });
      const timeslot = await Timeslot.findOne({ _id: booking.timeslotId });
      bike.status = 'available';
      timeslot.status = 'available';
      await bike.save();
      await timeslot.save();

      // Delete booking
      await Booking.deleteOne({ _id: bookingId });

      res.status(200).json({ message: 'Booking deleted successfully' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

// Start the Express app
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
