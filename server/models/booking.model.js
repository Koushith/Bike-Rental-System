import mongoose from 'mongoose';
import Bike from './bike';
import Timeslot from './timeslot';
import Customer from './customer';

const bookingSchema = new mongoose.Schema({
  bike: { type: mongoose.Schema.Types.ObjectId, ref: 'Bike', required: true },
  timeslot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Timeslot',
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  bookingDate: { type: Date, default: Date.now },
});

bookingSchema.index({ bike: 1, timeslot: 1 }, { unique: true });

bookingSchema.path('timeslot').validate(async function (value) {
  const timeslot = await mongoose.model('Timeslot').findById(value);
  return timeslot && timeslot.isAvailable;
}, 'Selected timeslot is not available');

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
