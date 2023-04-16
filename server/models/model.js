/**
 * Ignore this file
 */

const mongoose = require('mongoose');

// Define the Bike schema
const bikeSchema = new mongoose.Schema({
  bikeId: { type: String, required: true, unique: true }, // Unique bike ID
  bikeName: { type: String, required: true },
  isAvailable: { type: Boolean, default: true }, // Bike availability status
});

// Define the Timeslot schema
const timeslotSchema = new mongoose.Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  isAvailable: { type: Boolean, default: true }, // Timeslot availability status
});

// Define the Booking schema
const bookingSchema = new mongoose.Schema({
  bike: { type: mongoose.Schema.Types.ObjectId, ref: 'Bike', required: true }, // Reference to Bike model
  timeslot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Timeslot',
    required: true,
  }, // Reference to Timeslot model
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  bookingDate: { type: Date, default: Date.now }, // Booking creation date
});

// Create indexes for optimized queries
bikeSchema.index({ bikeId: 1 }, { unique: true });
timeslotSchema.index({ startTime: 1, endTime: 1 }, { unique: true });
bookingSchema.index({ bike: 1, timeslot: 1 }, { unique: true });

// Apply validations
bikeSchema.path('bikeId').validate(async function (value) {
  const bike = await this.constructor.findOne({ bikeId: value });
  return !bike; // Bike ID must be unique
}, 'Bike ID already exists');

timeslotSchema.path('endTime').validate(function (value) {
  return value > this.startTime; // End time must be after start time
}, 'End time must be after start time');

bookingSchema.path('timeslot').validate(async function (value) {
  const timeslot = await mongoose.model('Timeslot').findById(value);
  return timeslot && timeslot.isAvailable; // Timeslot must be available
}, 'Selected timeslot is not available');

// Define the mongoose models
const Bike = mongoose.model('Bike', bikeSchema);
const Timeslot = mongoose.model('Timeslot', timeslotSchema);
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = { Bike, Timeslot, Booking };
